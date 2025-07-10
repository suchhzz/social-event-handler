import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { connect, NatsConnection, StringCodec } from "nats";

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
    console.log(`Published to ${subject}`, message);
  }
}
