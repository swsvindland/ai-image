import { Text } from "react-native";

import { View } from "@/components/Themed";
import { ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { checkSubscriptionStatus } from "@/app/(tabs)/two";
import Free from "@/components/Free";
import Paid from "@/components/Paid";

export default function TabOneScreen() {
  const premiumQuery = useQuery({
    queryKey: ["Premium"],
    queryFn: checkSubscriptionStatus,
  });

  if (premiumQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-4 pt-4">
        <ActivityIndicator animating={true} size="large" />
        <Text>Checking Subscription Status...</Text>
      </View>
    );
  }

  if (!premiumQuery.data) {
    return <Free />;
  }

  return <Paid />;
}
