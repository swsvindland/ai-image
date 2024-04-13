import { View } from "@/components/Themed";

import RevenueCatUI from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { ExternalLink } from "@/components/ExternalLink";

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkSubscriptionStatus = async () => {
  try {
    // TODO: Fix this hack for testing
    await sleep(1000);
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
        <>
          <View className="flex items-center justify-center px-4 pt-4">
            <ExternalLink href="https://svindland.dev/privacy">
              <Text className="uppercase underline bold text-purple-500">
                Privacy Policy
              </Text>
            </ExternalLink>
            <ExternalLink href="https://svindland.dev/terms">
              <Text className="uppercase underline bold text-purple-500">
                Terms
              </Text>
            </ExternalLink>
          </View>
          <View className="flex w-full h-full justify-center items-center p-4">
            <Text className="dark:text-white">
              You are subscribed to Premium. Manage your subscription in the
              apple app store.
            </Text>
          </View>
        </>
      ) : (
        <View className="flex-1">
          <View className="flex items-center justify-center px-4 pt-4">
            <ExternalLink href="https://svindland.dev/privacy">
              <Text className="uppercase underline bold text-purple-500">
                Privacy Policy
              </Text>
            </ExternalLink>
            <ExternalLink href="https://svindland.dev/terms">
              <Text className="uppercase underline bold text-purple-500">
                Terms
              </Text>
            </ExternalLink>
          </View>
          <RevenueCatUI.Paywall onDismiss={() => premiumQuery.refetch()} />
        </View>
      )}
    </View>
  );
}
