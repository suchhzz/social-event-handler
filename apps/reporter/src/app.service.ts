import { Injectable } from "@nestjs/common";

import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";

@Injectable()
export class ReportsService {
  async getEventsReport(query: EventsReportDto): Promise<any> {
    return {
      message: "Events report placeholder",
      filters: query,
    };
  }

  async getRevenueReport(query: RevenueReportDto): Promise<any> {
    return {
      message: "Revenue report placeholder",
      filters: query,
    };
  }

  async getDemographicsReport(query: DemographicsReportDto): Promise<any> {
    return {
      message: "Demographics report placeholder",
      filters: query,
    };
  }
}
