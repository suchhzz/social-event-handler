import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NatsService } from "./nats/nats.service";

@Module({
  controllers: [AppController],
  providers: [NatsService],
})
export class AppModule {}
