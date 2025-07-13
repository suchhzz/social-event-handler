import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck } from "@nestjs/terminus";
import { NatsService } from "../nats/nats.service";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private natsService: NatsService
  ) {}

  @Get("liveness")
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.natsService.checkConnection()]);
  }
}
