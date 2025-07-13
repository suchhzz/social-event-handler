import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { MetricsService } from "./metrics.service";

@Controller()
export class MetricsController {
  constructor(private readonly matricsService: MetricsService) {}

  @Get("metrics")
  async metrics(@Res() res: Response) {
    res.set("Content-Type", "text/plain");
    res.send(await this.matricsService.getMetrics());
  }
}
