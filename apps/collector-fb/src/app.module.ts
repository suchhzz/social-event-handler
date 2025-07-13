import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { FacebookConsumer } from "./consumers/facebook.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { FacebookRepository } from "./app.repository";
import { FacebookService } from "./app.service";
import { MetricsService } from "./metrics/metrics.service";
import { MetricsController } from "./metrics/metrics.controller";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { CorrelationIdMiddleware } from "./common/middlewares/correlation-id.middleware";
import { LoggerModule } from "./logger/winston-logger.module";
import { NatsHealthIndicator } from "./health/nats.health";
import { PrismaHealthIndicator } from "./health/prisma.health";

@Module({
  imports: [TerminusModule, LoggerModule],
  controllers: [MetricsController, HealthController],
  providers: [
    NatsService,
    FacebookConsumer,
    FacebookRepository,
    FacebookService,
    PrismaService,
    MetricsService,
    NatsHealthIndicator,
    PrismaHealthIndicator,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
