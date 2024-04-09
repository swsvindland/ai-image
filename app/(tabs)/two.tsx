import { View } from "@/components/Themed";

import RevenueCatUI from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkSubscriptionStatus = async () => {
  try {
    // TODO: Fix this hack for testing
    await sleep(3000);
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active["premium"] !== "undefined";
  } catch (e) {
    // Error fetching purchaser info
    return false;
  }
};

export default function TabTwoScreen() {
  const premiumQuery = useQuery({
    queryKey: ["Premium"],
    queryFn: checkSubscriptionStatus,
  });

  return (
    <View className="flex-1">
      {premiumQuery.data ? (
        <View className="flex w-full h-full justify-center items-center p-4">
          <Text>
            You are subscribed to Premium. Manage your subscription in the apple
            app store.
          </Text>
        </View>
      ) : (
        <RevenueCatUI.Paywall onDismiss={() => premiumQuery.refetch()} />
      )}
    </View>
  );
}
