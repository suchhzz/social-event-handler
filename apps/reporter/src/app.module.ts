import { Module } from "@nestjs/common";
import { ReportsController } from "./app.controller";
import { ReportsService } from "./app.service";
import { ReportsRepository } from "./app.repository";
import { PrismaService } from "./prisma/prisma.service";
import { MetricsController } from "./metrics/metrics.controller";

@Module({
  controllers: [ReportsController, MetricsController],
  providers: [ReportsService, ReportsRepository, PrismaService],
})
export class AppModule {}
