import { parseTiktokEvent } from "./tiktok-event.schema";

describe("parseTiktokEvent", () => {
  it("should parse valid top funnel event", () => {
    const validTopEvent = {
      eventId: "ttk-123e4567-e89b-12d3-a456-426614174000",
      timestamp: new Date().toISOString(),
      source: "tiktok",
      funnelStage: "top",
      eventType: "video.view",
      data: {
        user: {
          userId: "user-1",
          username: "johndoe",
          followers: 1000,
        },
        engagement: {
          watchTime: 120,
          percentageWatched: 75,
          device: "Android",
          country: "US",
          videoId: "vid-101",
        },
      },
    };

    expect(() => parseTiktokEvent(validTopEvent)).not.toThrow();
  });

  it("should parse valid bottom funnel event", () => {
    const validBottomEvent = {
      eventId: "ttk-abcdef12-3456-7890-abcd-ef1234567890",
      timestamp: new Date().toISOString(),
      source: "tiktok",
      funnelStage: "bottom",
      eventType: "purchase",
      data: {
        user: {
          userId: "user-2",
          username: "janedoe",
          followers: 500,
        },
        engagement: {
          actionTime: new Date().toISOString(),
          profileId: null,
          purchasedItem: "hat",
          purchaseAmount: "15.99",
        },
      },
    };

    expect(() => parseTiktokEvent(validBottomEvent)).not.toThrow();
  });

  it("should throw error for missing required fields", () => {
    const invalidEvent = {
      eventId: "ttk-invalid",
      funnelStage: "top",
    };

    expect(() => parseTiktokEvent(invalidEvent)).toThrow();
  });

  it("should throw error for invalid datetime", () => {
    const invalidDateEvent = {
      eventId: "ttk-invalid",
      timestamp: "not-a-date",
      source: "tiktok",
      funnelStage: "bottom",
      eventType: "purchase",
      data: {
        user: {
          userId: "user-x",
          username: "anon",
          followers: 10,
        },
        engagement: {
          actionTime: "not-a-date",
          profileId: null,
          purchasedItem: null,
          purchaseAmount: null,
        },
      },
    };

    expect(() => parseTiktokEvent(invalidDateEvent)).toThrow();
  });
});
