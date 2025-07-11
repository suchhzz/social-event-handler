import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { TiktokService } from "../app.service";
import { parseTiktokEvent } from "./schemas/tiktok-event.schema";

@Injectable()
export class TiktokConsumer implements OnModuleInit {
  private readonly logger = new Logger(TiktokConsumer.name);

  constructor(
    private readonly natsService: NatsService,
    private readonly tiktokService: TiktokService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.tiktok", async (event) => {
      console.log("receive event");

      const result = parseTiktokEvent(event);

      if (!result) {
        return;
      }

      await this.tiktokService.saveEvent(result);
    });
  }
}
