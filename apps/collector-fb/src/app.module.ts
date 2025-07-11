import { Module } from "@nestjs/common";
import { NatsService } from "./nats/nats.service";
import { FacebookConsumer } from "./consumers/facebook.consumer";
import { PrismaService } from "./prisma/prisma.service";
import { FacebookRepository } from "./app.repository";
import { FacebookService } from "./app.service";

@Module({
  providers: [
    NatsService,
    FacebookConsumer,
    FacebookRepository,
    FacebookService,
    PrismaService,
  ],
})
export class AppModule {}
