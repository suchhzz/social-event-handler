import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { MetricsService } from "./metrics.service";

@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get("metrics")
  async metrics(@Res() res: Response) {
    res.set("Content-Type", "text/plain; version=0.0.4");
    res.send(await this.metricsService.getMetrics());
  }
}
