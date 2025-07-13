import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NatsService } from "./nats/nats.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";

@Module({
  controllers: [AppController, MetricsController],
  providers: [NatsService, MetricsService],
})
export class AppModule {}
