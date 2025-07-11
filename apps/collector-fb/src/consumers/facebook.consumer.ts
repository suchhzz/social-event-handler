import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats/nats.service";
import { FacebookEventSchema } from "../schemas/facebook-event.schema";
import { FacebookService } from "../app.service";

@Injectable()
export class FacebookConsumer implements OnModuleInit {
  private readonly logger = new Logger(FacebookConsumer.name);

  constructor(
    private readonly natsService: NatsService,
    private readonly facebookService: FacebookService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribe("events.facebook", async (event) => {
      const result = FacebookEventSchema.safeParse(event);

      if (!result.success) {
        return;
      }

      await this.facebookService.saveEvent(result.data);
    });
  }
}
