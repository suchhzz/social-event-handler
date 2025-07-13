import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let correlationId = req.headers["x-correlation-id"];
    if (!correlationId) {
      correlationId = uuidv4();
    }
    req.correlationId = correlationId;
    res.setHeader("X-Correlation-Id", correlationId);
    next();
  }
}
