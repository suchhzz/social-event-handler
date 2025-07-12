import { IsString, IsOptional, IsISO8601, IsEnum } from "class-validator";
import { Source } from "../types/event-types";

export class RevenueReportDto {
  @IsISO8601()
  from?: string;

  @IsISO8601()
  to?: string;

  @IsEnum(Source)
  source?: Source;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
