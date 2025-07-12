import { Injectable } from "@nestjs/common";
import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async fetchEventsReport(query: EventsReportDto) {
    const { from, to, source, funnelStage, eventType } = query;

    if (!source) {
      throw new Error("Source (facebook/tiktok) is required");
    }

    const where: any = {
      ...(from && { timestamp: { gte: new Date(from) } }),
      ...(to && {
        timestamp: {
          ...(from ? { gte: new Date(from) } : {}),
          lte: new Date(to),
        },
      }),
      ...(funnelStage && { funnelStage }),
      ...(eventType && { eventType }),
    };

    let events: any = [];

    if (source === "facebook") {
      events = await this.prisma.facebookEvent.findMany({
        where,
        include: {
          user: true,
          engagementTop: true,
          engagementBottom: true,
        },
        orderBy: {
          timestamp: "desc",
        },
      });
    }

    if (source === "tiktok") {
      events = await this.prisma.tiktokEvent.findMany({
        where,
        include: {
          user: true,
          engagementTop: true,
          engagementBottom: true,
        },
        orderBy: {
          timestamp: "desc",
        },
      });
    }

    return {
      data: events,
      filters: query,
    };
  }

  async fetchRevenueReport(query: RevenueReportDto): Promise<any> {
    const { from, to, source, campaignId } = query;

    if (!source) {
      throw new Error("Source (facebook/tiktok) is required");
    }

    const dateFilter = {
      timestamp: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    };

    let revenue: any = { totalRevenue: 0, transactions: [] };

    if (source === "facebook") {
      revenue.transactions =
        await this.prisma.facebookEngagementBottom.findMany({
          where: {
            ...((campaignId && { campaignId }) || {}),
            ...dateFilter,
            event: {
              eventType: "checkout_complete",
              ...dateFilter,
            },
          },
          include: {
            event: true,
          },
        });

      revenue.totalRevenue = revenue.transactions.reduce(
        (acc: number, item: any) => {
          const amount = parseFloat(item.purchaseAmount || "0");
          return acc + (isNaN(amount) ? 0 : amount);
        },
        0
      );
    }

    if (source === "tiktok") {
      revenue.transactions = await this.prisma.tiktokEngagementBottom.findMany({
        where: {
          actionTime: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
          event: {
            eventType: "purchase",
            timestamp: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          },
        },
        include: {
          event: true,
        },
      });

      revenue.totalRevenue = revenue.transactions.reduce(
        (acc: number, item: any) => {
          const amount = parseFloat(item.purchaseAmount || "0");
          return acc + (isNaN(amount) ? 0 : amount);
        },
        0
      );
    }

    return {
      data: {
        totalRevenue: revenue.totalRevenue,
        transactions: revenue.transactions,
      },
      filters: query,
    };
  }

  async fetchDemographicsReport(query: DemographicsReportDto): Promise<any> {
    const { from, to, source } = query;

    if (!source) {
      throw new Error("Source (facebook/tiktok) is required");
    }

    const dateFilter = {
      ...(from || to
        ? {
            events: {
              some: {
                timestamp: {
                  ...(from ? { gte: new Date(from) } : {}),
                  ...(to ? { lte: new Date(to) } : {}),
                },
              },
            },
          }
        : {}),
    };

    if (source === "facebook") {
      const users = await this.prisma.facebookUser.findMany({
        where: dateFilter,
        select: {
          id: true,
          name: true,
          age: true,
          gender: true,
          location: {
            select: {
              country: true,
              city: true,
            },
          },
          events: {
            where: {
              ...(from || to
                ? {
                    timestamp: {
                      ...(from ? { gte: new Date(from) } : {}),
                      ...(to ? { lte: new Date(to) } : {}),
                    },
                  }
                : {}),
            },
            select: {
              eventType: true,
              timestamp: true,
            },
          },
        },
      });

      return {
        data: users,
        filters: query,
      };
    }

    if (source === "tiktok") {
      const users = await this.prisma.tiktokUser.findMany({
        where: dateFilter,
        select: {
          id: true,
          username: true,
          followers: true,
          events: {
            where: {
              ...(from || to
                ? {
                    timestamp: {
                      ...(from ? { gte: new Date(from) } : {}),
                      ...(to ? { lte: new Date(to) } : {}),
                    },
                  }
                : {}),
            },
            select: {
              eventType: true,
              timestamp: true,
            },
          },
        },
      });

      return {
        data: users,
        filters: query,
      };
    }

    return {
      data: [],
      filters: query,
    };
  }
}
