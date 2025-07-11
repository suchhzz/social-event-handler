import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { FacebookEventParsed } from "./schemas/facebook-event.schema";

@Injectable()
export class FacebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveEventWithRelations(event: FacebookEventParsed) {
    let fbUser = await this.prisma.facebookUser.findFirst({
      where: { userId: event.data.user.userId },
    });

    if (!fbUser) {
      fbUser = await this.prisma.facebookUser.create({
        data: {
          userId: event.data.user.userId,
          name: event.data.user.name,
          age: event.data.user.age,
          gender: event.data.user.gender.replace("-", "_") as
            | "male"
            | "female"
            | "non_binary",
          country: event.data.user.location.country,
          city: event.data.user.location.city,
        },
      });
    }

    let fbEngagement;

    if (event.funnelStage === "top") {
      const engagementTop = event.data.engagement as {
        actionTime: string;
        referrer: "newsfeed" | "marketplace" | "groups";
        videoId: string | null;
      };

      fbEngagement = await this.prisma.facebookEngagement.create({
        data: {
          actionTime: new Date(engagementTop.actionTime),
          referrer: engagementTop.referrer,
          videoId: engagementTop.videoId,
          adId: null,
          campaignId: null,
          clickPosition: null,
          device: null,
          browser: null,
          purchaseAmount: null,
        },
      });
    } else if (event.funnelStage === "bottom") {
      const engagementBottom = event.data.engagement as {
        adId: string;
        campaignId: string;
        clickPosition: "top_left" | "bottom_right" | "center";
        device: "mobile" | "desktop";
        browser: "Chrome" | "Firefox" | "Safari";
        purchaseAmount: string | null;
      };

      fbEngagement = await this.prisma.facebookEngagement.create({
        data: {
          actionTime: null,
          referrer: null,
          videoId: null,
          adId: engagementBottom.adId,
          campaignId: engagementBottom.campaignId,
          clickPosition: engagementBottom.clickPosition,
          device: engagementBottom.device,
          browser: engagementBottom.browser,
          purchaseAmount: engagementBottom.purchaseAmount,
        },
      });
    }

    await this.prisma.event.create({
      data: {
        timestamp: new Date(event.timestamp),
        source: "facebook",
        funnelStage: event.funnelStage,
        eventType: event.eventType,
        facebookUserId: fbUser.id,
        facebookEngagementId: fbEngagement.id,
      },
    });
  }
}
