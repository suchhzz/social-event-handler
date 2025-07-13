import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { WinstonLogger } from "../logger/winston-logger.service";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: WinstonLogger) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Prisma connected");
  }

  async onModuleDestroy() {
    await this.gracefulDisconnect();
  }

  async gracefulDisconnect() {
    try {
      await this.$disconnect();
      this.logger.log("Prisma disconnected gracefully");
    } catch (error: Error | any) {
      this.logger.error("Error during Prisma disconnect", error.stack);
    }
  }
}
