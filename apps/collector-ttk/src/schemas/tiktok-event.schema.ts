import { z } from "zod";

const TiktokUserSchema = z
  .object({
    userId: z.string().uuid(),
    username: z.string().min(1),
    followers: z.number().int().nonnegative(),
  })
  .strict();

const TiktokEngagementTopSchema = z
  .object({
    watchTime: z.number().int().positive(),
    percentageWatched: z.number().min(0).max(100),
    device: z.enum(["Android", "iOS", "Desktop"]),
    country: z.string().min(2),
    videoId: z.string().min(1),
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
    eventId: z.string().regex(/^ttk-[a-f0-9-]{36}$/i),
    timestamp: z.string().datetime(),
    source: z.literal("tiktok"),
    funnelStage: z.literal("top"),
    eventType: z.enum(["video.view", "like", "share", "comment"]),
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementTopSchema,
    }),
  }),
  z.object({
    eventId: z.string().regex(/^ttk-[a-f0-9-]{36}$/i),
    timestamp: z.string().datetime(),
    source: z.literal("tiktok"),
    funnelStage: z.literal("bottom"),
    eventType: z.enum(["profile.visit", "purchase", "follow"]),
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementBottomSchema,
    }),
  }),
]);

export function parseTiktokEvent(input: unknown) {
  return TiktokEventSchema.parse(input);
}
