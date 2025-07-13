import { Body, Controller, Get, Post } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { MetricsService } from "./metrics/metrics.service";

@Controller("events")
export class AppController {
  constructor(
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService
  ) {}

  @Post()
  async handleEvent(@Body() body: any) {
    if (!Array.isArray(body)) {
      return {
        status: "error",
        message: "Expected an array of events",
      };
    }

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
      } catch (error) {
        this.metricsService.failedEvents.inc();
        console.error("Failed to publish event to NATS:", error);
      }
    }

    return {
      status: "ok",
      message: "Events processed and published to NATS",
    };
  }
}
