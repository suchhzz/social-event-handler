import { IsOptional, IsEnum, IsISO8601, IsString } from "class-validator";
import { FunnelStage, Source } from "../types/event-types";

export class EventsReportDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsEnum(Source)
  source?: Source;

  @IsOptional()
  @IsEnum(FunnelStage)
  funnelStage?: FunnelStage;

  @IsOptional()
  @IsString()
  eventType?: string;
}
