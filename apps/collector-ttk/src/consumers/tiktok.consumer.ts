import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { TiktokEventSchema } from "../schemas/tiktok-event.schema";
import { TiktokService } from "../app.service";

@Injectable()
export class TiktokConsumer implements OnModuleInit {
  private readonly logger = new Logger(TiktokConsumer.name);

  constructor(
    private readonly natsService: NatsService,
    private readonly tiktokService: TiktokService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.tiktok", async (event) => {
      const result = TiktokEventSchema.safeParse(event);

      if (!result.success) {
        return;
      }

      await this.tiktokService.saveEvent(result.data);
    });
  }
}
