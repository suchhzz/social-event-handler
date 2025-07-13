import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { parseFacebookEvent } from "../schemas/facebook-event.schema";
import { FacebookService } from "../app.service";
import { MetricsService } from "../metrics/metrics.service";

@Injectable()
export class FacebookConsumer implements OnModuleInit {
  private readonly logger = new Logger(FacebookConsumer.name);

  constructor(
    private readonly natsService: NatsService,
    private readonly facebookService: FacebookService,
    private readonly metricsService: MetricsService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.facebook", async (event) => {
      this.metricsService.acceptedEvents.inc();

      const result = parseFacebookEvent(event);

      if (!result) {
        this.metricsService.failedEvents.inc();
        return;
      }

      await this.facebookService.saveEvent(result);
      this.metricsService.processedEvents.inc();
    });
  }
}
