import { Module } from "@nestjs/common";
import { ReportsController } from "./app.controller";
import { ReportsService } from "./app.service";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class AppModule {}
