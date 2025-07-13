import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { connect, NatsConnection, StringCodec } from "nats";
import { HealthIndicatorResult, HealthCheckError } from "@nestjs/terminus";
import { WinstonLogger } from "../logger/winston-logger.service";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: WinstonLogger) {}

  private nc: NatsConnection | null = null;
  private sc = StringCodec();
  private isShuttingDown = false;

  async onModuleInit() {
    this.nc = await connect({ servers: ["nats://nats:4222"] });
    console.log("Connected to NATS");
  }

  async onModuleDestroy() {
    this.gracefulDisconnect();
  }

  publish(subject: string, message: any) {
    if (!this.nc) {
      throw new Error("NATS connection is not established");
    }

    const data = this.sc.encode(JSON.stringify(message));
    this.nc.publish(subject, data);
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
