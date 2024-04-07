import { Image, Keyboard, FlatList } from "react-native";

import { View } from "@/components/Themed";
import { useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";

export default function TabOneScreen() {
  const [model, setModel] = useState<string>("default");
  const [searchModel, setSearchModel] = useState<string>("default");
  const [text, onChangeText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [number, setNumber] = useState<number>(1);
  const [searchNumber, setSearchNumber] = useState<number>(1);

  const query = useQuery({
    queryKey: ["Images", searchModel, searchText, searchNumber],
    queryFn: async () => {
      const images: string[] = [];

      if (!searchText) return images;

      for (let i = 0; i < searchNumber; ++i) {
        const file = await FileSystem.downloadAsync(
          `https://swsvindland--${searchModel}-fastapi-app.modal.run/?prompt=${searchText}`,
          FileSystem.documentDirectory + searchModel + searchText + i + ".jpeg",
          {},
        );

        images.push(file.uri);
      }

      return images;
    },
  });

  const handleSubmit = () => {
    setSearchText(text);
    setSearchNumber(number);
    setSearchModel(model);
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 items-center justify-center px-4 pt-4">
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
      <View className="w-full mx-2 justify-center px-4 py-2">
        <Slider
          value={number}
          onValueChange={(value) => setNumber(value[0])}
          step={1}
          minimumValue={1}
          maximumValue={4}
        />
      </View>
      <View className="w-full justify-center pb-2 px-4">
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={query.isLoading}
        >
          Generate {number} Images
        </Button>
      </View>
      <FlatList
        data={query.data}
        renderItem={({ item }) => (
          <Image
            className="w-96 h-96 rounded-2xl shadow my-2"
            source={{
              uri: item,
            }}
          />
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
