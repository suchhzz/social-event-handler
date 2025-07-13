import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { Gender } from "@prisma/client";
import {
  Browser,
  ClickPosition,
  Device,
  FacebookEventType,
  FunnelStage,
  Referrer,
} from "./types/enums";

@Injectable()
export class FacebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeString(str: string): string {
    return str.replace(".", "_").replace("-", "_").toLowerCase();
  }

  private toFunnelStage(value: string): FunnelStage {
    const normalized = this.normalizeString(value);
    if (normalized === "top" || normalized === "bottom") {
      return normalized;
    }
    throw new Error(`Invalid FunnelStage: ${value}`);
  }

  private toFacebookEventType(value: string): FacebookEventType {
    const normalized = this.normalizeString(value);
    const validTypes: FacebookEventType[] = [
      "ad_view",
      "page_like",
      "comment",
      "video_view",
      "ad_click",
      "form_submission",
      "checkout_complete",
    ];

    if (validTypes.includes(normalized as FacebookEventType)) {
      return normalized as FacebookEventType;
    }
    throw new Error(`Invalid FacebookEventType: ${value}`);
  }

  private toGender(value: string): Gender {
    const normalized = this.normalizeString(value);
    if (
      normalized === "male" ||
      normalized === "female" ||
      normalized === "non_binary"
    ) {
      return normalized;
    }
    return "non_binary";
  }

  private toReferrer(value: string): Referrer {
    const normalized = this.normalizeString(value);
    if (
      normalized === "newsfeed" ||
      normalized === "marketplace" ||
      normalized === "groups"
    ) {
      return normalized;
    }
    return "newsfeed";
  }

  private toClickPosition(value: string): ClickPosition {
    const normalized = this.normalizeString(value);
    if (
      normalized === "top_left" ||
      normalized === "bottom_right" ||
      normalized === "center"
    ) {
      return normalized;
    }
    return "center";
  }

  private toDevice(value: string): Device {
    const normalized = this.normalizeString(value);
    if (normalized === "mobile" || normalized === "desktop") {
      return normalized;
    }
    return "mobile";
  }

  private toBrowser(value: string): Browser {
    const capitalized =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (
      capitalized === "Chrome" ||
      capitalized === "Firefox" ||
      capitalized === "Safari"
    ) {
      return capitalized;
    }
    return "Chrome";
  }

  async saveEvent(rawEvent: any) {
    const user = await this.prisma.facebookUser.upsert({
      where: { userId: rawEvent.data.user.userId },
      create: {
        userId: rawEvent.data.user.userId,
        name: rawEvent.data.user.name,
        age: rawEvent.data.user.age,
        gender: this.toGender(rawEvent.data.user.gender),
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
        gender: this.toGender(rawEvent.data.user.gender),
      },
    });

    let engagementTopId: number | null = null;
    let engagementBottomId: number | null = null;

    if (rawEvent.funnelStage === "top") {
      const engagement = await this.prisma.facebookEngagementTop.create({
        data: {
          actionTime: new Date(rawEvent.data.engagement.actionTime),
          referrer: this.toReferrer(rawEvent.data.engagement.referrer),
          videoId: rawEvent.data.engagement.videoId,
        },
      });
      engagementTopId = engagement.id;
    } else {
      const engagement = await this.prisma.facebookEngagementBottom.create({
        data: {
          adId: rawEvent.data.engagement.adId,
          campaignId: rawEvent.data.engagement.campaignId,
          clickPosition: this.toClickPosition(
            rawEvent.data.engagement.clickPosition
          ),
          device: this.toDevice(rawEvent.data.engagement.device),
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
        funnelStage: this.toFunnelStage(rawEvent.funnelStage),
        eventType: this.toFacebookEventType(rawEvent.eventType),
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
