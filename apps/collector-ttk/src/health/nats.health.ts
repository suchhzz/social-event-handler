import { Injectable } from "@nestjs/common";
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from "@nestjs/terminus";
import { NatsService } from "../nats/nats.service";

@Injectable()
export class NatsHealthIndicator extends HealthIndicator {
  constructor(private readonly natsService: NatsService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isConnected = this.natsService.isConnected();

    if (isConnected) {
      return this.getStatus("nats", true);
    }

    throw new HealthCheckError(
      "NATS is not connected",
      this.getStatus("nats", false)
    );
  }
}
