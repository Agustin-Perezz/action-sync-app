import type { TrelloClientPort } from "@/application/ports/trello-client.port";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { ConnectTrelloRepository } from "./connect-trello.repository.interface";
import type { ConnectTrelloRequestDto } from "./connect-trello.request.dto";
import type { ConnectTrelloResponseDto } from "./connect-trello.response.dto";

export class ConnectTrelloUseCase {
  constructor(
    private readonly repository: ConnectTrelloRepository,
    private readonly trelloClient: TrelloClientPort,
  ) {}

  async execute(
    dto: ConnectTrelloRequestDto,
  ): Promise<ConnectTrelloResponseDto> {
    const member = await this.trelloClient.getMember(dto.token);
    const connection = TrelloConnection.create({
      userId: dto.userId,
      trelloMemberId: member.id,
      accessToken: dto.token,
    });
    await this.repository.save(connection);
    return { memberName: member.fullName };
  }
}
