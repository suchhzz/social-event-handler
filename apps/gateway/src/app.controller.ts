import { Body, Controller, Post, Req } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { MetricsService } from "./metrics/metrics.service";
import { WinstonLogger } from "./logger/winston-logger.service";

@Controller("events")
export class AppController {
  constructor(
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService,
    private readonly logger: WinstonLogger
  ) {}

  @Post()
  async handleEvent(@Body() body: any, @Req() req: any) {
    this.logger.log(
      `Received request with correlationId: ${req.correlationId}`,
      "AppController"
    );

    if (!Array.isArray(body)) {
      this.logger.warn(
        "Request body is not an array",
        "AppController",
        req.correlationId
      );
      return {
        status: "error",
        message: "Expected an array of events",
      };
    }

    this.logger.log(
      `Processing ${body.length} events`,
      "AppController",
      req.correlationId
    );

    let processedCount = 0;
    let failedCount = 0;

    for (const event of body) {
      this.metricsService.acceptedEvents.inc();

      const source = event.source?.toLowerCase();

      let topic: string;
      if (source === "facebook") {
        topic = "events.facebook";
      } else if (source === "tiktok") {
        topic = "events.tiktok";
      } else {
        topic = "events.others";
      }

      try {
        await this.natsService.publish(topic, event);
        this.metricsService.processedEvents.inc();
        processedCount++;
      } catch (error) {
        this.metricsService.failedEvents.inc();
        failedCount++;
        this.logger.error(
          `Failed to publish event to NATS on topic "${topic}": ${
            error instanceof Error ? error.message : "error"
          }`,
          "AppController",
          req.correlationId
        );
      }
    }

    this.logger.log(
      `Finished processing events. Successfully processed: ${processedCount}, Failed: ${failedCount}`,
      "AppController",
      req.correlationId
    );

    return {
      status: "ok",
      message: "Events processed and published to NATS",
    };
  }
}
