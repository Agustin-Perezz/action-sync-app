import { InvalidTaskError, TaskNotFoundError } from "@/domain/entities/errors";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { UpdateTaskRepository } from "./update-task.repository.interface";
import type { UpdateTaskRequestDto } from "./update-task.request.dto";
import type { UpdateTaskResponseDto } from "./update-task.response.dto";

// ponytail: builds only the fields that are present (Partial<Task>), so the
// repo can PATCH just the changed columns. title/description/dueDate are the
// only editable fields — status and trelloCardId are managed by sync.
export class UpdateTaskUseCase {
  constructor(private readonly repository: UpdateTaskRepository) {}

  async execute(dto: UpdateTaskRequestDto): Promise<UpdateTaskResponseDto> {
    const task = await this.repository.findById(dto.id);
    if (!task || task.userId !== dto.userId) {
      throw new TaskNotFoundError(dto.id);
    }
    if (task.status === TASK_STATUS.SYNCED) {
      throw new InvalidTaskError("cannot edit a synced task");
    }
    const fields: Partial<{
      title: string;
      description: string;
      dueDate: string | null;
    }> = {};
    if (dto.title !== undefined) fields.title = dto.title;
    if (dto.description !== undefined) fields.description = dto.description;
    if (dto.dueDate !== undefined) fields.dueDate = dto.dueDate;
    const updated = await this.repository.update(dto.id, fields);
    return { task: updated };
  }
}
