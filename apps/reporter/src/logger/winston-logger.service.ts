import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context, correlationId }) => {
            return `${timestamp} [${level}]${context ? ` [${context}]` : ""}${
              correlationId ? ` [cid:${correlationId}]` : ""
            } : ${message}`;
          }
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: any, context?: string, correlationId?: string) {
    this.logger.info(message, { context, correlationId });
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    correlationId?: string
  ) {
    this.logger.error(message, { trace, context, correlationId });
  }

  warn(message: any, context?: string, correlationId?: string) {
    this.logger.warn(message, { context, correlationId });
  }

  debug?(message: any, context?: string, correlationId?: string) {
    this.logger.debug(message, { context, correlationId });
  }

  verbose?(message: any, context?: string, correlationId?: string) {
    this.logger.verbose(message, { context, correlationId });
  }
}
