import { parseFacebookEvent } from "./facebook-event.schema";

describe("FacebookEventSchema", () => {
  it("should parse a valid top funnel event", () => {
    const validTopEvent = {
      eventId: "1",
      timestamp: new Date().toISOString(),
      source: "facebook",
      funnelStage: "top",
      eventType: "ad.view",
      data: {
        user: {
          userId: "user123",
          name: "John Doe",
          age: 30,
          gender: "male",
          location: {
            country: "US",
            city: "NYC",
          },
        },
        engagement: {
          actionTime: new Date().toISOString(),
          referrer: "newsfeed",
          videoId: "vid123",
        },
      },
    };

    expect(() => parseFacebookEvent(validTopEvent)).not.toThrow();
  });

  it("should parse a valid bottom funnel event", () => {
    const validBottomEvent = {
      eventId: "2",
      timestamp: new Date().toISOString(),
      source: "facebook",
      funnelStage: "bottom",
      eventType: "ad.click",
      data: {
        user: {
          userId: "user456",
          name: "Jane Smith",
          age: 25,
          gender: "female",
          location: {
            country: "UK",
            city: "London",
          },
        },
        engagement: {
          adId: "ad123",
          campaignId: "camp456",
          clickPosition: "center",
          device: "desktop",
          browser: "Chrome",
          purchaseAmount: null,
        },
      },
    };

    expect(() => parseFacebookEvent(validBottomEvent)).not.toThrow();
  });

  it("should throw for invalid funnelStage", () => {
    const invalid = { ...getValidTopEvent(), funnelStage: "middle" };
    expect(() => parseFacebookEvent(invalid)).toThrow();
  });

  it("should throw for invalid gender", () => {
    const invalid = {
      ...getValidTopEvent(),
      data: {
        ...getValidTopEvent().data,
        user: {
          ...getValidTopEvent().data.user,
          gender: "robot",
        },
      },
    };
    expect(() => parseFacebookEvent(invalid)).toThrow();
  });

  it("should throw for invalid eventType in bottom funnel", () => {
    const invalid = {
      ...getValidBottomEvent(),
      eventType: "page.like",
    };
    expect(() => parseFacebookEvent(invalid)).toThrow();
  });

  it("should throw if user.age is not a number", () => {
    const invalid = {
      ...getValidTopEvent(),
      data: {
        ...getValidTopEvent().data,
        user: {
          ...getValidTopEvent().data.user,
          age: "thirty",
        },
      },
    };
    expect(() => parseFacebookEvent(invalid)).toThrow();
  });
});

function getValidTopEvent() {
  return {
    eventId: "1",
    timestamp: new Date().toISOString(),
    source: "facebook",
    funnelStage: "top",
    eventType: "ad.view",
    data: {
      user: {
        userId: "user123",
        name: "John Doe",
        age: 30,
        gender: "male",
        location: {
          country: "US",
          city: "NYC",
        },
      },
      engagement: {
        actionTime: new Date().toISOString(),
        referrer: "newsfeed",
        videoId: "vid123",
      },
    },
  };
}

function getValidBottomEvent() {
  return {
    eventId: "2",
    timestamp: new Date().toISOString(),
    source: "facebook",
    funnelStage: "bottom",
    eventType: "form.submission",
    data: {
      user: {
        userId: "user456",
        name: "Jane Smith",
        age: 25,
        gender: "female",
        location: {
          country: "UK",
          city: "London",
        },
      },
      engagement: {
        adId: "ad123",
        campaignId: "camp456",
        clickPosition: "bottom_right",
        device: "mobile",
        browser: "Firefox",
        purchaseAmount: "99.99",
      },
    },
  };
}
