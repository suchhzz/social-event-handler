import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
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
      const correlationId = uuidv4();

      this.logger.log(`[cid:${correlationId}] Received TikTok event`);
      this.metricsService.acceptedEvents.inc();

      const result = parseTiktokEvent(event);

      if (!result) {
        this.metricsService.failedEvents.inc();
        this.logger.warn(`[cid:${correlationId}] Failed to parse TikTok event`);
        return;
      }

      try {
        await this.tiktokService.saveEvent(result);
        this.metricsService.processedEvents.inc();
        this.logger.log(
          `[cid:${correlationId}] TikTok event saved successfully`
        );
      } catch (error) {
        this.metricsService.failedEvents.inc();
        if (error instanceof Error) {
          this.logger.error(
            `[cid:${correlationId}] Error saving TikTok event: ${error.message}`,
            error.stack
          );
        } else {
          this.logger.error(
            `[cid:${correlationId}] Unknown error saving TikTok event: ${String(
              error
            )}`
          );
        }
      }
    });
  }
}
