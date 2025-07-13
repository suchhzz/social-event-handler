import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { connect, NatsConnection, StringCodec } from "nats";
import { HealthIndicatorResult, HealthCheckError } from "@nestjs/terminus";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: ["nats://nats:4222"] });
    console.log("Connected to NATS");
  }

  async onModuleDestroy() {
    if (this.nc) {
      await this.nc.close();
    }
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
}
