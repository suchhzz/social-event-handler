import { Module } from "@nestjs/common";
import { ReportsController } from "./app.controller";
import { ReportsService } from "./app.service";
import { ReportsRepository } from "./app.repository";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, PrismaService],
})
export class AppModule {}
