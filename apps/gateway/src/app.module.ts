import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NatsService } from "./nats/nats.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { CorrelationIdMiddleware } from "./common/middlewares/correlation-id.middleware";
import { LoggerModule } from "./logger/winston-logger.module";

@Module({
  imports: [TerminusModule, LoggerModule],
  controllers: [AppController, MetricsController, HealthController],
  providers: [NatsService, MetricsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
