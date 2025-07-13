import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck } from "@nestjs/terminus";
import { NatsHealthIndicator } from "./nats.health";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly natsIndicator: NatsHealthIndicator
  ) {}

  @Get("liveness")
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  readiness() {
    return this.health.check([async () => this.natsIndicator.isHealthy()]);
  }
}
