import { Injectable } from "@nestjs/common";
import { FacebookRepository } from "./app.repository";

@Injectable()
export class FacebookService {
  constructor(private readonly facebookRepo: FacebookRepository) {}

  async saveEvent(event: any) {
    await this.facebookRepo.saveEvent(event);
  }
}
