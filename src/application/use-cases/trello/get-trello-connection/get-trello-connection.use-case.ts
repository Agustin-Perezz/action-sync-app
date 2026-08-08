import type { GetTrelloConnectionRepository } from "./get-trello-connection.repository.interface";
import type { GetTrelloConnectionRequestDto } from "./get-trello-connection.request.dto";
import type { GetTrelloConnectionResponseDto } from "./get-trello-connection.response.dto";

// ponytail: returns row state only, does NOT probe Trello getMember to verify
// the token. memberName is null because the TrelloConnection entity stores
// trelloMemberId (not a display name) and the migration has no member_name
// column. An expired token surfaces on the next Trello call (getBoards/
// createCard). Design #72 open question #1 resolved: row state. A future PR
// can add a member_name column or probe Trello if the UI needs the name.
export class GetTrelloConnectionUseCase {
  constructor(private readonly repository: GetTrelloConnectionRepository) {}

  async execute(
    dto: GetTrelloConnectionRequestDto,
  ): Promise<GetTrelloConnectionResponseDto> {
    const connection = await this.repository.findByUserId(dto.userId);
    if (!connection) {
      return {
        connected: false,
        memberName: null,
        trelloMemberId: null,
      };
    }
    return {
      connected: true,
      memberName: null,
      trelloMemberId: connection.trelloMemberId,
    };
  }
}
