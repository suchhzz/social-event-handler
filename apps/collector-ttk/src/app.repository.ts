import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class TiktokRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDbFormat(str: string): string {
    return str.replace(".", "_").toLowerCase();
  }

  async saveEvent(rawEvent: any) {
    const user = await this.prisma.tiktokUser.upsert({
      where: { userId: rawEvent.data.user.userId },
      create: {
        userId: rawEvent.data.user.userId,
        username: rawEvent.data.user.username,
        followers: rawEvent.data.user.followers,
      },
      update: {
        username: rawEvent.data.user.username,
        followers: rawEvent.data.user.followers,
      },
    });

    let engagementTopId: number | null = null;
    let engagementBottomId: number | null = null;

    if (rawEvent.funnelStage === "top") {
      const engagement = rawEvent.data.engagement;
      const created = await this.prisma.tiktokEngagementTop.create({
        data: {
          watchTime: engagement.watchTime,
          percentageWatched: engagement.percentageWatched,
          device: engagement.device.toUpperCase() as any,
          country: engagement.country,
          videoId: engagement.videoId,
        },
      });
      engagementTopId = created.id;
    } else {
      const engagement = rawEvent.data.engagement;
      const created = await this.prisma.tiktokEngagementBottom.create({
        data: {
          actionTime: new Date(engagement.actionTime),
          profileId: engagement.profileId || null,
          purchasedItem: engagement.purchasedItem || null,
          purchaseAmount: engagement.purchaseAmount || null,
        },
      });
      engagementBottomId = created.id;
    }

    await this.prisma.tiktokEvent.create({
      data: {
        eventId: rawEvent.eventId,
        timestamp: new Date(rawEvent.timestamp),
        source: "tiktok",
        funnelStage: rawEvent.funnelStage.toLowerCase() as any,
        eventType: this.toDbFormat(rawEvent.eventType) as any,
        userId: user.id,
        ...(engagementTopId && {
          engagementTop: { connect: { id: engagementTopId } },
        }),
        ...(engagementBottomId && {
          engagementBottom: { connect: { id: engagementBottomId } },
        }),
      },
    });
  }
}
