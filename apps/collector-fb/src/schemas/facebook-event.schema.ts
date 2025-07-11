import { z } from "zod";

// 🔹 Общие значения
const FunnelStageSchema = z.enum(["top", "bottom"]);
const GenderSchema = z.enum(["male", "female", "non-binary"]);
const SourceSchema = z.literal("facebook");

// 🔹 Типы ивентов
const FacebookTopEventTypeSchema = z.enum([
  "ad.view",
  "page.like",
  "comment",
  "video.view",
]);
const FacebookBottomEventTypeSchema = z.enum([
  "ad.click",
  "form.submission",
  "checkout.complete",
]);
const FacebookEventTypeSchema = z.union([
  FacebookTopEventTypeSchema,
  FacebookBottomEventTypeSchema,
]);

// 🔹 Локация
const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

// 🔹 Пользователь
const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number().int(),
  gender: GenderSchema,
  location: FacebookUserLocationSchema,
});

// 🔹 Engagement Top
const FacebookEngagementTopSchema = z.object({
  actionTime: z.string().datetime(),
  referrer: z.enum(["newsfeed", "marketplace", "groups"]),
  videoId: z.string().nullable(),
});

// 🔹 Engagement Bottom
const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(["top_left", "bottom_right", "center"]),
  device: z.enum(["mobile", "desktop"]),
  browser: z.enum(["Chrome", "Firefox", "Safari"]),
  purchaseAmount: z.string().nullable(),
});

// 🔹 Engagement (с union по этапу)
const FacebookEngagementSchema = z.union([
  FacebookEngagementTopSchema,
  FacebookEngagementBottomSchema,
]);

// 🔹 Финальная схема события
export const FacebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string().datetime(),
  source: SourceSchema,
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});

// 🔹 Тип из схемы
export type FacebookEventParsed = z.infer<typeof FacebookEventSchema>;
