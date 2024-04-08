import { View } from "@/components/Themed";

import RevenueCatUI from "react-native-purchases-ui";

export default function TabTwoScreen() {
  return (
    <View className="flex-1">
      <RevenueCatUI.Paywall />
    </View>
  );
}
