import { Injectable } from "@nestjs/common";
import { FacebookEventParsed } from "./schemas/facebook-event.schema";
import { FacebookRepository } from "./app.repository";

@Injectable()
export class FacebookService {
  constructor(private readonly facebookRepo: FacebookRepository) {}

  async saveEvent(event: FacebookEventParsed) {
    await this.facebookRepo.saveEventWithRelations(event);
  }
}
