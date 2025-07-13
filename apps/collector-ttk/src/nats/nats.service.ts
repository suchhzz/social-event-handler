import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { HealthCheckError, HealthIndicatorResult } from "@nestjs/terminus";
import { connect, NatsConnection, StringCodec, Subscription } from "nats";
import { WinstonLogger } from "../logger/winston-logger.service";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: WinstonLogger) {}

  private nc: NatsConnection | null = null;
  private subscriptions: Subscription[] = [];
  private sc = StringCodec();
  private isShuttingDown = false;

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

    this.gracefulDisconnect();
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
        } catch (error: Error | any) {
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

  isConnected(): boolean {
    return this.nc != null && !this.nc.isClosed();
  }

  async checkConnection(): Promise<HealthIndicatorResult> {
    const connected = this.isConnected();

    if (connected) {
      return { nats: { status: "up" } };
    }

    throw new HealthCheckError("NATS is not connected", {
      nats: { status: "down" },
    });
  }

  async gracefulDisconnect() {
    if (this.isShuttingDown || !this.nc) return;
    this.isShuttingDown = true;

    try {
      await this.nc.drain();
      this.logger.log("NATS connection drained successfully");
    } catch (err: Error | any) {
      this.logger.error("Error draining NATS connection:", err);
    } finally {
      await this.nc.close();
      this.logger.log("NATS connection closed");
    }
  }
}
