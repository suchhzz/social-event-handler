import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { TiktokService } from "../app.service";
import { parseTiktokEvent } from "../schemas/tiktok-event.schema";
import { MetricsService } from "../metrics/metrics.service";

@Injectable()
export class TiktokConsumer implements OnModuleInit {
  private readonly logger = new Logger(TiktokConsumer.name);

  constructor(
    private readonly natsService: NatsService,
    private readonly tiktokService: TiktokService,
    private readonly metricsService: MetricsService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.tiktok", async (event) => {
      this.metricsService.acceptedEvents.inc();

      const result = parseTiktokEvent(event);

      if (!result) {
        this.metricsService.failedEvents.inc();
        return;
      }

      await this.tiktokService.saveEvent(result);
      this.metricsService.processedEvents.inc();
    });
  }
}
