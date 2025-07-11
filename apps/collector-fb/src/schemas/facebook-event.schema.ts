import { z } from "zod";

const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female", "non-binary"]),
  location: FacebookUserLocationSchema,
});

const FacebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(["newsfeed", "marketplace", "groups"]),
  videoId: z.string().nullable(),
});

const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(["top_left", "bottom_right", "center"]),
  device: z.enum(["mobile", "desktop"]),
  browser: z.enum(["Chrome", "Firefox", "Safari"]),
  purchaseAmount: z.string().nullable(),
});

const FacebookEventSchema = z.discriminatedUnion("funnelStage", [
  z.object({
    eventId: z.string(),
    timestamp: z.string(),
    source: z.literal("facebook"),
    funnelStage: z.literal("top"),
    eventType: z.enum(["ad.view", "page.like", "comment", "video.view"]),
    data: z.object({
      user: FacebookUserSchema,
      engagement: FacebookEngagementTopSchema,
    }),
  }),
  z.object({
    eventId: z.string(),
    timestamp: z.string(),
    source: z.literal("facebook"),
    funnelStage: z.literal("bottom"),
    eventType: z.enum(["ad.click", "form.submission", "checkout.complete"]),
    data: z.object({
      user: FacebookUserSchema,
      engagement: FacebookEngagementBottomSchema,
    }),
  }),
]);

export const parseFacebookEvent = (data: unknown) =>
  FacebookEventSchema.parse(data);
