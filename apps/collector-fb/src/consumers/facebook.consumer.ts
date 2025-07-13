import { Injectable, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { parseFacebookEvent } from "../schemas/facebook-event.schema";
import { FacebookService } from "../app.service";
import { MetricsService } from "../metrics/metrics.service";
import { WinstonLogger } from "../logger/winston-logger.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FacebookConsumer implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly facebookService: FacebookService,
    private readonly metricsService: MetricsService,
    private readonly logger: WinstonLogger
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.facebook", async (event) => {
      const correlationId = uuidv4();
      this.logger.log(
        "Received Facebook event",
        "FacebookConsumer",
        correlationId
      );

      this.metricsService.acceptedEvents.inc();

      const result = parseFacebookEvent(event);

      if (!result) {
        this.metricsService.failedEvents.inc();
        this.logger.warn(
          "Failed to parse Facebook event",
          "FacebookConsumer",
          correlationId
        );
        return;
      }

      try {
        await this.facebookService.saveEvent(result);
        this.metricsService.processedEvents.inc();
        this.logger.log(
          "Facebook event saved successfully",
          "FacebookConsumer",
          correlationId
        );
      } catch (error) {
        this.metricsService.failedEvents.inc();
        if (error instanceof Error) {
          this.logger.error(
            `Error saving Facebook event: ${error.message}`,
            error.stack,
            "FacebookConsumer",
            correlationId
          );
        } else {
          this.logger.error(
            `Unknown error saving Facebook event: ${String(error)}`,
            undefined,
            "FacebookConsumer",
            correlationId
          );
        }
      }
    });
  }
}
