import { Controller, Get, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { ReportsService } from "./app.service";
import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";
import { MetricsService } from "./metrics/metrics.service";
import { WinstonLogger } from "./logger/winston-logger.service";

@Controller("reports")
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly metricsService: MetricsService,
    private readonly logger: WinstonLogger
  ) {}

  @Get("events")
  async getEventsReport(@Query() query: EventsReportDto, @Req() req: any) {
    const correlationId = req.correlationId as string;
    this.logger.log(
      `[cid:${correlationId}] GET /reports/events start`,
      "ReportsController",
      correlationId
    );

    const endTimer = this.metricsService.httpRequestDurationSeconds.startTimer({
      method: "GET",
      route: "events",
    });

    try {
      const eventReports = await this.reportsService.getEventsReport(query);
      this.logger.log(
        `[cid:${correlationId}] GET /reports/events success`,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "200" });
      return eventReports;
    } catch (error) {
      this.logger.error(
        `[cid:${correlationId}] GET /reports/events error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        undefined,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "500" });
      throw error;
    }
  }

  @Get("revenue")
  async getRevenueReport(@Query() query: RevenueReportDto, @Req() req: any) {
    const correlationId = req.correlationId as string;
    this.logger.log(
      `[cid:${correlationId}] GET /reports/revenue start`,
      "ReportsController",
      correlationId
    );

    const endTimer = this.metricsService.httpRequestDurationSeconds.startTimer({
      method: "GET",
      route: "revenue",
    });

    try {
      const revenue = await this.reportsService.getRevenueReport(query);
      this.logger.log(
        `[cid:${correlationId}] GET /reports/revenue success`,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "200" });
      return revenue;
    } catch (error) {
      this.logger.error(
        `[cid:${correlationId}] GET /reports/revenue error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        undefined,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "500" });
      throw error;
    }
  }

  @Get("demographics")
  async getDemographicsReport(
    @Query() query: DemographicsReportDto,
    @Req() req: any
  ) {
    const correlationId = req.correlationId as string;
    this.logger.log(
      `[cid:${correlationId}] GET /reports/demographics start`,
      "ReportsController",
      correlationId
    );

    const endTimer = this.metricsService.httpRequestDurationSeconds.startTimer({
      method: "GET",
      route: "demographics",
    });

    try {
      const demographics = await this.reportsService.getDemographicsReport(
        query
      );
      this.logger.log(
        `[cid:${correlationId}] GET /reports/demographics success`,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "200" });
      return demographics;
    } catch (error) {
      this.logger.error(
        `[cid:${correlationId}] GET /reports/demographics error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        undefined,
        "ReportsController",
        correlationId
      );
      endTimer({ status: "500" });
      throw error;
    }
  }
}
