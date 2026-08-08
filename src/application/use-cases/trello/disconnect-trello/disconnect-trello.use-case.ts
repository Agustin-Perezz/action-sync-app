import type { DisconnectTrelloRepository } from "./disconnect-trello.repository.interface";
import type { DisconnectTrelloRequestDto } from "./disconnect-trello.request.dto";

export class DisconnectTrelloUseCase {
  constructor(private readonly repository: DisconnectTrelloRepository) {}

  async execute(dto: DisconnectTrelloRequestDto): Promise<void> {
    await this.repository.delete(dto.userId);
  }
}
