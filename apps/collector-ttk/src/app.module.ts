import { Module } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { TiktokConsumer } from "./consumers/tiktok.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { TiktokRepository } from "./app.repository";
import { TiktokService } from "./app.service";

@Module({
  providers: [
    NatsService,
    TiktokConsumer,
    TiktokRepository,
    TiktokService,
    PrismaService,
  ],
})
export class AppModule {}
