import { IsEnum, IsISO8601 } from "class-validator";
import { Source } from "../types/event-types";

export class DemographicsReportDto {
  @IsISO8601()
  from?: string;

  @IsISO8601()
  to?: string;

  @IsEnum(Source)
  source?: Source;
}
