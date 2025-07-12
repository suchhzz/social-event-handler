import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./app.service";
import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("events")
  async getEventsReport(@Query() query: EventsReportDto) {
    return this.reportsService.getEventsReport(query);
  }

  @Get("revenue")
  async getRevenueReport(@Query() query: RevenueReportDto) {
    return this.reportsService.getRevenueReport(query);
  }

  @Get("demographics")
  async getDemographicsReport(@Query() query: DemographicsReportDto) {
    return this.reportsService.getDemographicsReport(query);
  }
}
