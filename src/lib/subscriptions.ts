export const subscriptionSources = {
  newsletter: "newsletter",
  fireTrackerBeta: "fire-tracker-beta",
} as const;

export type SubscriptionSource =
  (typeof subscriptionSources)[keyof typeof subscriptionSources];

export type SubscribeRequestPayload = {
  email: string;
  source?: SubscriptionSource;
};

export function isSubscriptionSource(
  value: unknown,
): value is SubscriptionSource {
  return (
    typeof value === "string" &&
    Object.values(subscriptionSources).includes(value as SubscriptionSource)
  );
}
