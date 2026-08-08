import { InvalidTaskError, TaskNotFoundError } from "@/domain/entities/errors";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { DeleteTaskRepository } from "./delete-task.repository.interface";
import type { DeleteTaskRequestDto } from "./delete-task.request.dto";

export class DeleteTaskUseCase {
  constructor(private readonly repository: DeleteTaskRepository) {}

  async execute(dto: DeleteTaskRequestDto): Promise<void> {
    const task = await this.repository.findById(dto.id);
    if (!task || task.userId !== dto.userId) {
      throw new TaskNotFoundError(dto.id);
    }
    if (task.status === TASK_STATUS.SYNCED) {
      throw new InvalidTaskError("cannot delete a synced task");
    }
    await this.repository.delete(dto.id);
  }
}
