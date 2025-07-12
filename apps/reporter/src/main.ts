import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { collectDefaultMetrics, register } from "prom-client";

if (!register.getSingleMetric("process_cpu_user_seconds_total")) {
  collectDefaultMetrics();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
  console.log("Reporter started on http://localhost:3003");
}
bootstrap();
