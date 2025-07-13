import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class TiktokRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDbFormat(str: string): string {
    return str.replace(".", "_").toLowerCase();
  }

  private mapDevice(device: string): "Android" | "iOS" | "Desktop" {
    const map = {
      ANDROID: "Android",
      IOS: "iOS",
      DESKTOP: "Desktop",
    } as const;

    const key = device.toUpperCase() as keyof typeof map;
    const result = map[key];
    if (!result) throw new Error(`Unknown device: ${device}`);
    return result;
  }

  private mapFunnelStage(stage: string): "top" | "bottom" {
    const stageLower = stage.toLowerCase();
    if (stageLower === "top" || stageLower === "bottom")
      return stageLower as "top" | "bottom";
    throw new Error(`Unknown funnelStage: ${stage}`);
  }

  private mapEventType(eventType: string): string {
    return this.toDbFormat(eventType);
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

    if (rawEvent.funnelStage.toLowerCase() === "top") {
      const engagement = rawEvent.data.engagement;
      const created = await this.prisma.tiktokEngagementTop.create({
        data: {
          watchTime: engagement.watchTime,
          percentageWatched: engagement.percentageWatched,
          device: this.mapDevice(engagement.device),
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
        funnelStage: this.mapFunnelStage(rawEvent.funnelStage),
        eventType: this.mapEventType(rawEvent.eventType) as any,
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
