import { Module } from "@nestjs/common";
import { ReportsController } from "./app.controller";
import { ReportsService } from "./app.service";
import { ReportsRepository } from "./app.repository";
import { PrismaService } from "./prisma/prisma.service";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsService } from "./metrics/metrics.service";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [ReportsController, MetricsController, HealthController],
  providers: [ReportsService, ReportsRepository, PrismaService, MetricsService],
})
export class AppModule {}
