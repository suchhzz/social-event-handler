import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { connect, NatsConnection, StringCodec, Subscription } from "nats";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection | null = null;
  private subscriptions: Subscription[] = [];
  private sc = StringCodec();
  private readonly logger = new Logger(NatsService.name);

  async connect() {
    if (!this.nc) {
      this.nc = await connect({ servers: ["nats://nats:4222"] });
      this.logger.log("Connected to NATS");
    }
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    for (const sub of this.subscriptions) {
      await sub.unsubscribe();
    }
    this.subscriptions = [];

    if (this.nc) {
      await this.nc.close();
      this.logger.log("NATS connection closed");
    }
  }

  async subscribe(topic: string, handler: (msg: any) => Promise<void>) {
    if (!this.nc) {
      await this.connect();
    }

    if (!this.nc) {
      throw new Error("NATS connection is not established after connect");
    }

    const sub = this.nc.subscribe(topic);
    this.subscriptions.push(sub);
    this.logger.log(`Subscribed to topic: ${topic}`);

    (async () => {
      for await (const m of sub) {
        const dataStr = this.sc.decode(m.data);
        try {
          const data = JSON.parse(dataStr);
          await handler(data);
        } catch (error) {
          this.logger.error("Failed to process message", error);
        }
      }
    })();
  }

  publish(subject: string, message: any) {
    if (!this.nc) {
      throw new Error("NATS connection is not established");
    }

    const data = this.sc.encode(JSON.stringify(message));
    this.nc.publish(subject, data);
    this.logger.log(`Published to ${subject}`);
  }
}
