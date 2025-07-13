import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NatsService } from "./nats/nats.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [AppController, MetricsController, HealthController],
  providers: [NatsService, MetricsService],
})
export class AppModule {}
