import { Task } from "@/domain/entities/task.entity";
import type { AddManualTaskRepository } from "./add-manual-task.repository.interface";
import type { AddManualTaskRequestDto } from "./add-manual-task.request.dto";
import type { AddManualTaskResponseDto } from "./add-manual-task.response.dto";

// Review UI adds a blank task for the user to fill in. Task.create rejects
// empty title/description, so placeholder values are used.
const PLACEHOLDER_TITLE = "Untitled";
const PLACEHOLDER_DESCRIPTION = "Add description";

export class AddManualTaskUseCase {
  constructor(private readonly repository: AddManualTaskRepository) {}

  async execute(
    dto: AddManualTaskRequestDto,
  ): Promise<AddManualTaskResponseDto> {
    const task = Task.create({
      transcriptId: dto.transcriptId,
      userId: dto.userId,
      title: PLACEHOLDER_TITLE,
      description: PLACEHOLDER_DESCRIPTION,
      dueDate: null,
    });
    const saved = await this.repository.save(task);
    return { task: saved };
  }
}
