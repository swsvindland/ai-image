# ---
# lambda-test: false
# ---

from typing import Optional

from fastapi import FastAPI, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ## Basic setup

import io
from pathlib import Path

from modal import (
    Image,
    Mount,
    Stub,
    asgi_app,
    build,
    enter,
    gpu,
    method,
    web_endpoint,
)

# ## Define a container image
#
# To take advantage of Modal's blazing fast cold-start times, we'll need to download our model weights
# inside our container image with a download function. We ignore binaries, ONNX weights and 32-bit weights.
#
# Tip: avoid using global variables in this function to ensure the download step detects model changes and
# triggers a rebuild.


sdxl_image = (
    Image.debian_slim(python_version="3.10")
    .apt_install(
        "libglib2.0-0", "libsm6", "libxrender1", "libxext6", "ffmpeg", "libgl1"
    )
    .pip_install(
        "diffusers==0.26.3",
        "invisible_watermark==0.2.0",
        "transformers~=4.38.2",
        "accelerate==0.27.2",
        "safetensors==0.4.2",
    )
)

stub = Stub("default")

with sdxl_image.imports():
    import torch
    from diffusers import DiffusionPipeline
    from huggingface_hub import snapshot_download

# ## Load model and run inference
#
# The container lifecycle [`@enter` decorator](https://modal.com/docs/guide/lifecycle-functions#container-lifecycle-beta)
# loads the model at startup. Then, we evaluate it in the `run_inference` function.
#
# To avoid excessive cold-starts, we set the idle timeout to 240 seconds, meaning once a GPU has loaded the model it will stay
# online for 4 minutes before spinning down. This can be adjusted for cost/experience trade-offs.


@stub.cls(gpu=gpu.A10G(), container_idle_timeout=240, image=sdxl_image)
class Model:
    @build()
    def build(self):
        ignore = [
            "*.bin",
            "*.onnx_data",
            "*/diffusion_pytorch_model.safetensors",
        ]
        snapshot_download(
            'frankjoshua/juggernautXL_v8Rundiffusion'
        )

    @enter()
    def enter(self):
        load_options = dict(
            torch_dtype=torch.float16,
            use_safetensors=True,
            device_map="auto",
        )

        # Load base model
        self.base = DiffusionPipeline.from_pretrained(
            'frankjoshua/juggernautXL_v8Rundiffusion',
            **load_options
        )

    def _inference(self, prompt, n_steps=24, high_noise_frac=0.8):
        negative_prompt = ""
        image = self.base(
            prompt="masterpiece, best quality, very aesthetic, absurdres" + prompt,
            negative_prompt=negative_prompt,
            width=832,
            height=1216,
            guidance_scale=7,
            num_inference_steps=28
        ).images[0]

        byte_stream = io.BytesIO()
        image.save(byte_stream, format="JPEG")

        return byte_stream

    @method()
    def inference(self, prompt, n_steps=24, high_noise_frac=0.8):
        return self._inference(
            prompt, n_steps=n_steps, high_noise_frac=high_noise_frac
        ).getvalue()

web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@web_app.get("/")
async def handle_root(prompt):
    print(f"GET /     - received prompt={prompt}")
    image_bytes = Model().inference.remote(prompt)
    return Response(
        content=image_bytes,
        media_type="image/jpeg",
    )

@stub.function()
@asgi_app()
def fastapi_app():
    return web_app


if __name__ == "__main__":
    stub.deploy("webapp")
