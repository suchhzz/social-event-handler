import { Module } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { FacebookConsumer } from "./consumers/facebook.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { FacebookRepository } from "./app.repository";
import { FacebookService } from "./app.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [MetricsController, HealthController],
  providers: [
    NatsService,
    FacebookConsumer,
    FacebookRepository,
    FacebookService,
    PrismaService,
    MetricsService,
  ],
})
export class AppModule {}
