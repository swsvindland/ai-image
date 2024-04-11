import { Image, Keyboard, Text } from "react-native";

import { View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { checkSubscriptionStatus } from "@/app/(tabs)/two";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getTrialAmount = async () => {
  try {
    const value = await AsyncStorage.getItem("trial");
    if (value !== null) {
      return parseInt(value ?? "0");
    }
  } catch (e) {
    return 0;
  }
};

const saveTrialAmount = async (value: number) => {
  try {
    await AsyncStorage.setItem("trial", value.toString());
  } catch (e) {
    console.error(e);
  }
};

export default function Free() {
  const [model, setModel] = useState<string>("default");
  const [searchModel, setSearchModel] = useState<string>("default");
  const [text, onChangeText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [trialAmount, setTrialAmount] = useState<number | undefined>(undefined);
  const [generatedAmount, setGeneratedAmount] = useState<number>(0);

  const premiumQuery = useQuery({
    queryKey: ["Premium"],
    queryFn: checkSubscriptionStatus,
  });

  const trialAmountQuery = useQuery({
    queryKey: ["TrialAmount"],
    queryFn: getTrialAmount,
  });

  useEffect(() => {
    // Setup trial
    if (
      trialAmount === undefined &&
      trialAmountQuery.data == null &&
      !trialAmountQuery.isLoading
    ) {
      setTrialAmount(10);
      saveTrialAmount(10);
    } else if (trialAmount === undefined && trialAmountQuery.data != null) {
      setTrialAmount(trialAmountQuery.data);
    }
  }, [trialAmount, trialAmountQuery.data]);

  useEffect(() => {
    if (premiumQuery.data) setTrialAmount(9999);
  }, [premiumQuery.data]);

  const query = useQuery({
    queryKey: ["Images", searchModel, searchText, generatedAmount],
    queryFn: async () => {
      if (!searchText) return null;

      return await FileSystem.downloadAsync(
        `https://swsvindland--${searchModel}-fastapi-app.modal.run/?prompt=${searchText}`,
        FileSystem.documentDirectory + searchModel + searchText + ".jpeg",
        {},
      );
    },
  });

  const handleSubmit = async () => {
    if (trialAmount == null || trialAmount === 0) return;

    setGeneratedAmount(generatedAmount + 1);

    setSearchText(text);
    setSearchModel(model);
    Keyboard.dismiss();

    const newTrial = trialAmount < 1 ? 0 : trialAmount - 1;
    setTrialAmount(newTrial);
    await saveTrialAmount(newTrial);
  };

  return (
    <View className="flex-1 items-center px-4 pt-4">
      <Text className="py-2 dark:text-white">
        Welcome to Mojo! You have {trialAmount} images left in your free trial.
        Go to settings tab to subscribe.
      </Text>
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
      <View className="w-full justify-center pb-2 px-4">
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={query.isLoading}
          disabled={!trialAmount}
        >
          Generate Image
        </Button>
      </View>
      <Image
        className="w-80 h-80 rounded-2xl my-2"
        source={{
          uri: query.data?.uri,
        }}
      />
    </View>
  );
}
