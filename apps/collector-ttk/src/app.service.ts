import { Injectable } from "@nestjs/common";
import { TiktokRepository } from "./app.repository";

@Injectable()
export class TiktokService {
  constructor(private readonly tiktokRepo: TiktokRepository) {}

  async saveEvent(event: any) {
    await this.tiktokRepo.saveEvent(event);
  }
}
