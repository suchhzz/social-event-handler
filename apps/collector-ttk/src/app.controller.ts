import { Controller, OnModuleInit, Logger } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.tiktok", async (event) => {
      // this.logger.log(`Received Tiktok event: ${JSON.stringify(event)}`);
    });
  }
}
