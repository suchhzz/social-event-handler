import { Injectable } from "@nestjs/common";
import { Counter, Registry } from "prom-client";

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  acceptedEvents = new Counter({
    name: "collector_ttk_events_accepted_total",
    help: "Total accepted events",
    registers: [this.registry],
  });

  processedEvents = new Counter({
    name: "collector_ttk_events_processed_total",
    help: "Total processed events",
    registers: [this.registry],
  });

  failedEvents = new Counter({
    name: "collector_ttk_events_failed_total",
    help: "Total failed events",
    registers: [this.registry],
  });

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
