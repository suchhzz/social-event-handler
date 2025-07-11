import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./app.service";
import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";
import { httpRequestDurationMicroseconds } from "./metrics/metrics";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("events")
  async getEventsReport(@Query() query: EventsReportDto) {
    const endTimer = httpRequestDurationMicroseconds.startTimer({
      method: "GET",
      route: "events",
    });

    try {
      const eventReports = this.reportsService.getEventsReport(query);
      endTimer({ status: 200 });

      return eventReports;
    } catch (error) {
      endTimer({ status: 500 });
      throw error;
    }
  }

  @Get("revenue")
  async getRevenueReport(@Query() query: RevenueReportDto) {
    const endTimer = httpRequestDurationMicroseconds.startTimer({
      method: "GET",
      route: "revenue",
    });

    try {
      const revenue = await this.reportsService.getRevenueReport(query);
      endTimer({ status: "200" });
      return revenue;
    } catch (error) {
      endTimer({ status: "500" });
      throw error;
    }
  }

  @Get("demographics")
  async getDemographicsReport(@Query() query: DemographicsReportDto) {
    const endTimer = httpRequestDurationMicroseconds.startTimer({
      method: "GET",
      route: "demographics",
    });

    try {
      const demographics = await this.reportsService.getDemographicsReport(
        query
      );
      endTimer({ status: "200" });
      return demographics;
    } catch (error) {
      endTimer({ status: "500" });
      throw error;
    }
  }
}
