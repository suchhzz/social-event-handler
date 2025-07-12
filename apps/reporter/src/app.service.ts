import { Injectable } from "@nestjs/common";
import { EventsReportDto } from "./dto/events-report.dto";
import { RevenueReportDto } from "./dto/revenue.dto";
import { DemographicsReportDto } from "./dto/demographics.dto";
import { ReportsRepository } from "./app.repository";

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getEventsReport(query: EventsReportDto): Promise<any> {
    return this.reportsRepository.fetchEventsReport(query);
  }

  async getRevenueReport(query: RevenueReportDto): Promise<any> {
    return this.reportsRepository.fetchRevenueReport(query);
  }

  async getDemographicsReport(query: DemographicsReportDto): Promise<any> {
    return this.reportsRepository.fetchDemographicsReport(query);
  }
}
