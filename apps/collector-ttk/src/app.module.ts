import { Module } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { TiktokConsumer } from "./consumers/tiktok.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { TiktokRepository } from "./app.repository";
import { TiktokService } from "./app.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [MetricsController, HealthController],
  providers: [
    NatsService,
    TiktokConsumer,
    TiktokRepository,
    TiktokService,
    PrismaService,
    MetricsService,
  ],
})
export class AppModule {}
