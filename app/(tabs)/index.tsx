import {
  Text,
  TextInput,
  Image,
  Keyboard,
  ScrollView,
  Button,
  SafeAreaView,
  Pressable,
} from "react-native";

import { View } from "@/components/Themed";
import React, { useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { Link } from "expo-router";

export default function TabOneScreen() {
  const [text, onChangeText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [number, setNumber] = useState<number>(1);

  const handleSubmit = () => {
    setSearchText(text);
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="flex flex-row h-24 justify-center">
        <TextInput
          className="flex-1 border border-gray-400 rounded m-2 p-4"
          onChangeText={onChangeText}
          value={text}
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
      <View className="w-full justify-center py-8 px-4">
        <Button onPress={handleSubmit} title="Submit" />
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
  );
}
