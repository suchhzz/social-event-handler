import { Injectable } from "@nestjs/common";
import { collectDefaultMetrics, Histogram, Registry } from "prom-client";

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  httpRequestDurationSeconds: Histogram<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.httpRequestDurationSeconds = new Histogram({
      name: "http_request_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "status"],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  recordHttpRequestDuration(
    method: string,
    route: string,
    status: string,
    durationSeconds: number
  ) {
    this.httpRequestDurationSeconds
      .labels(method, route, status)
      .observe(durationSeconds);
  }
}
