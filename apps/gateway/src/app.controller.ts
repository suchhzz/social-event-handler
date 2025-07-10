import { Body, Controller, Get, Post } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";

@Controller("events")
export class AppController {
  constructor(private readonly natsService: NatsService) {}

  @Post()
  async handleEvent(@Body() body: any) {
    console.log("Received event:", body);

    try {
      await this.natsService.publish("events", body);

      return {
        status: "ok",
        message: "Event processed and published to NATS",
      };
    } catch (error) {
      console.error("Failed to publish event to NATS:", error);
      return {
        status: "error",
        message: "Event processed but failed to publish to NATS",
      };
    }
  }
}
