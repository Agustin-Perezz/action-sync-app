import type { TrelloBoard } from "@/application/ports/trello-client.port";
import type { Task } from "@/domain/entities/task.entity";

export type GetReviewDataResponseDto = {
  tasks: Task[];
  boards: TrelloBoard[];
};
