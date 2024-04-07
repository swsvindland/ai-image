import {
  Text,
  Image,
  Keyboard,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import { View } from "@/components/Themed";
import { useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { Link } from "expo-router";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

export default function TabOneScreen() {
  const [model, setModel] = useState<string>("default");
  const [text, onChangeText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [number, setNumber] = useState<number>(1);

  const handleSubmit = () => {
    setSearchText(text);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-center justify-center p-4">
        <SegmentedButtons
          value={model}
          onValueChange={setModel}
          buttons={[
            {
              value: "default",
              label: "Default",
            },
            {
              value: "realistic",
              label: "Realistic",
            },
            { value: "anime", label: "Anime" },
          ]}
        />
        <View className="flex flex-row justify-center">
          <TextInput
            label="Prompt"
            className="flex-1 my-2"
            onChangeText={onChangeText}
            value={text}
            multiline
            numberOfLines={4}
          />
        </View>
        <View className="w-full mx-2 align-stretch justify-center px-4 py-2">
          <Slider
            value={number}
            onValueChange={(value) => setNumber(value[0])}
            step={1}
            minimumValue={1}
            maximumValue={4}
          />
          <Text>{number}</Text>
        </View>
        <View className="w-full justify-center pt-8 pb-2 px-4">
          <Button mode="contained" onPress={handleSubmit}>
            Submit
          </Button>
        </View>
        <ScrollView>
          <View className="flex flex-col justify-center gap-4">
            {Array.from(Array(number).keys()).map((index) => (
              <Link key={index} href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Image
                      className="w-96 h-96 rounded-2xl shadow"
                      source={{
                        // uri: `https://swsvindland--stable-diffusion-xl-fastapi-app.modal.run/?prompt=${searchText}`,
                        uri: "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Pfp.jpg",
                      }}
                    />
                  )}
                </Pressable>
              </Link>
            ))}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
