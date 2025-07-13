import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class FacebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDbFormat(str: string): string {
    return str.replace(".", "_").replace("-", "_").toLowerCase();
  }

  async saveEvent(rawEvent: any) {
    const user = await this.prisma.facebookUser.upsert({
      where: { userId: rawEvent.data.user.userId },
      create: {
        userId: rawEvent.data.user.userId,
        name: rawEvent.data.user.name,
        age: rawEvent.data.user.age,
        gender: this.toDbFormat(rawEvent.data.user.gender),
        location: {
          create: {
            country: rawEvent.data.user.location.country,
            city: rawEvent.data.user.location.city,
          },
        },
      },
      update: {
        name: rawEvent.data.user.name,
        age: rawEvent.data.user.age,
        gender: this.toDbFormat(rawEvent.data.user.gender),
      },
    });

    let engagementTopId: number | null = null;
    let engagementBottomId: number | null = null;

    if (rawEvent.funnelStage === "top") {
      const engagement = await this.prisma.facebookEngagementTop.create({
        data: {
          actionTime: new Date(rawEvent.data.engagement.actionTime),
          referrer: this.toDbFormat(rawEvent.data.engagement.referrer),
          videoId: rawEvent.data.engagement.videoId,
        },
      });
      engagementTopId = engagement.id;
    } else {
      const engagement = await this.prisma.facebookEngagementBottom.create({
        data: {
          adId: rawEvent.data.engagement.adId,
          campaignId: rawEvent.data.engagement.campaignId,
          clickPosition: this.toDbFormat(
            rawEvent.data.engagement.clickPosition
          ),
          device: this.toDbFormat(rawEvent.data.engagement.device),
          browser: rawEvent.data.engagement.browser,
          purchaseAmount: rawEvent.data.engagement.purchaseAmount,
        },
      });
      engagementBottomId = engagement.id;
    }

    await this.prisma.facebookEvent.create({
      data: {
        eventId: rawEvent.eventId,
        timestamp: new Date(rawEvent.timestamp),
        source: "facebook",
        funnelStage: this.toDbFormat(rawEvent.funnelStage),
        eventType: this.toDbFormat(rawEvent.eventType),
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
