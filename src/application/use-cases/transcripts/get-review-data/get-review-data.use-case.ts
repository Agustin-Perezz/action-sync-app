import type {
  TrelloBoard,
  TrelloClientPort,
} from "@/application/ports/trello-client.port";
import type { GetReviewDataRepository } from "./get-review-data.repository.interface";
import type { GetReviewDataRequestDto } from "./get-review-data.request.dto";
import type { GetReviewDataResponseDto } from "./get-review-data.response.dto";

export class GetReviewDataUseCase {
  constructor(
    private readonly repository: GetReviewDataRepository,
    private readonly trelloClient: TrelloClientPort,
  ) {}

  async execute(
    dto: GetReviewDataRequestDto,
  ): Promise<GetReviewDataResponseDto> {
    const tasks = await this.repository.findDraftTasksByTranscript(
      dto.transcriptId,
    );
    const connection = await this.repository.findTrelloConnection(dto.userId);
    const boards: TrelloBoard[] = connection
      ? await this.trelloClient.getBoards(connection.accessToken)
      : [];
    return { tasks, boards };
  }
}
