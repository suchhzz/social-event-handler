import { z } from "zod";

const TiktokUserSchema = z
  .object({
    userId: z.string(),
    username: z.string(),
    followers: z.number(),
  })
  .strict();

const TiktokEngagementTopSchema = z
  .object({
    watchTime: z.number(),
    percentageWatched: z.number(),
    device: z.string(),
    country: z.string(),
    videoId: z.string(),
  })
  .strict();

const TiktokEngagementBottomSchema = z
  .object({
    actionTime: z.string().datetime(),
    profileId: z.string().nullable(),
    purchasedItem: z.string().nullable(),
    purchaseAmount: z.string().nullable(),
  })
  .strict();

const TiktokEventSchema = z.discriminatedUnion("funnelStage", [
  z.object({
    eventId: z.string(),
    timestamp: z.string().datetime(),
    source: z.literal("tiktok"),
    funnelStage: z.literal("top"),
    eventType: z.string(),
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementTopSchema,
    }),
  }),
  z.object({
    eventId: z.string(),
    timestamp: z.string().datetime(),
    source: z.literal("tiktok"),
    funnelStage: z.literal("bottom"),
    eventType: z.string(),
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementBottomSchema,
    }),
  }),
]);

export function parseTiktokEvent(input: unknown) {
  return TiktokEventSchema.parse(input);
}
