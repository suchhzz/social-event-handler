import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { TiktokEventParsed } from "./schemas/tiktok-event.schema";

@Injectable()
export class TiktokRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveEventWithRelations(event: TiktokEventParsed) {
    let ttUser = await this.prisma.tiktokUser.findFirst({
      where: { userId: event.data.user.userId },
    });

    if (!ttUser) {
      ttUser = await this.prisma.tiktokUser.create({
        data: {
          userId: event.data.user.userId,
          username: event.data.user.username,
          followers: event.data.user.followers,
        },
      });
    }

    let ttEngagement;

    if (event.funnelStage === "top") {
      const engagementTop = event.data.engagement as {
        watchTime: number;
        percentageWatched: number;
        device: "Android" | "iOS" | "Desktop";
        country: string;
        videoId: string;
      };

      ttEngagement = await this.prisma.tiktokEngagement.create({
        data: {
          watchTime: engagementTop.watchTime,
          percentageWatched: engagementTop.percentageWatched,
          device: engagementTop.device,
          country: engagementTop.country,
          videoId: engagementTop.videoId,
          actionTime: null,
          profileId: null,
          purchasedItem: null,
          purchaseAmount: null,
        },
      });
    } else if (event.funnelStage === "bottom") {
      const engagementBottom = event.data.engagement as {
        actionTime: string;
        profileId: string | null;
        purchasedItem: string | null;
        purchaseAmount: string | null;
      };

      ttEngagement = await this.prisma.tiktokEngagement.create({
        data: {
          watchTime: null,
          percentageWatched: null,
          device: null,
          country: null,
          videoId: null,
          actionTime: new Date(engagementBottom.actionTime),
          profileId: engagementBottom.profileId,
          purchasedItem: engagementBottom.purchasedItem,
          purchaseAmount: engagementBottom.purchaseAmount,
        },
      });
    }

    await this.prisma.event.create({
      data: {
        timestamp: new Date(event.timestamp),
        source: "tiktok",
        funnelStage: event.funnelStage,
        eventType: event.eventType,
        tiktokUserId: ttUser.id,
        tiktokEngagementId: ttEngagement.id,
      },
    });
  }
}
