import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { NatsService } from "./nats/nats.service";
import { WinstonLogger } from "./logger/winston-logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });

  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  const natsService = app.get(NatsService);

  const server = await app.listen(3000);
  console.log("Gateway started on http://localhost:3000");

  const gracefulShutdown = async () => {
    console.log("\nStarting graceful shutdown...");

    await natsService.gracefulDisconnect();

    console.log("Graceful shutdown completed");
    process.exit(0);
  };

  process.on("SIGTERM", () => {
    console.log("adsadsa");
  });
  process.on("SIGINT", () => {
    console.log("adsadsa");
  });
}
bootstrap();
