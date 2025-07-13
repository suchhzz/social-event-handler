import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck } from "@nestjs/terminus";
import { PrismaHealthIndicator } from "./prisma.health";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator
  ) {}

  @Get("liveness")
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.prismaIndicator.isHealthy()]);
  }
}
