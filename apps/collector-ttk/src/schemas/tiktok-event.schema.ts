import { z } from "zod";

const FunnelStageSchema = z.enum(["top", "bottom"]);
const SourceSchema = z.literal("tiktok");

const TiktokTopEventTypeSchema = z.enum([
  "video.view",
  "like",
  "share",
  "comment",
]);
const TiktokBottomEventTypeSchema = z.enum([
  "profile.visit",
  "purchase",
  "follow",
]);
const TiktokEventTypeSchema = z.union([
  TiktokTopEventTypeSchema,
  TiktokBottomEventTypeSchema,
]);

const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number().int(),
});

const TiktokEngagementTopSchema = z.object({
  watchTime: z.number().int(),
  percentageWatched: z.number(),
  device: z.enum(["Android", "iOS", "Desktop"]),
  country: z.string(),
  videoId: z.string(),
});

const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string().datetime(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

const TiktokEngagementSchema = z.union([
  TiktokEngagementTopSchema,
  TiktokEngagementBottomSchema,
]);

export const TiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string().datetime(),
  source: SourceSchema,
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventTypeSchema,
  data: z.object({
    user: TiktokUserSchema,
    engagement: TiktokEngagementSchema,
  }),
});

export type TiktokEventParsed = z.infer<typeof TiktokEventSchema>;
