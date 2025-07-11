import { Injectable } from "@nestjs/common";
import { TiktokEventParsed } from "./schemas/tiktok-event.schema";
import { TiktokRepository } from "./app.repository";

@Injectable()
export class TiktokService {
  constructor(private readonly tiktokRepo: TiktokRepository) {}

  async saveEvent(event: TiktokEventParsed) {
    await this.tiktokRepo.saveEventWithRelations(event);
  }
}
