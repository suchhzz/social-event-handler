import { Module } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { FacebookConsumer } from "./consumers/facebook.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { FacebookRepository } from "./app.repository";
import { FacebookService } from "./app.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";

@Module({
  controllers: [MetricsController],
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
