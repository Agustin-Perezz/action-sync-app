import { describe, expect, it, vi } from "vitest";
import { Task } from "@/domain/entities/task.entity";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { AddManualTaskRepository } from "./add-manual-task.repository.interface";
import { AddManualTaskUseCase } from "./add-manual-task.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";

describe("AddManualTaskUseCase", () => {
  it("saves a draft task with placeholder title and description and returns it with an id", async () => {
    const saved = Task.create({
      id: "00000000-0000-4000-8000-000000000011",
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      title: "Untitled",
      description: "Add description",
    });
    const save = vi.fn().mockResolvedValue(saved);
    const repository: AddManualTaskRepository = { save };
    const useCase = new AddManualTaskUseCase(repository);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
    });

    expect(save).toHaveBeenCalledTimes(1);
    const [persisted] = save.mock.calls[0];
    expect(persisted).toBeInstanceOf(Task);
    expect(persisted.toObject()).toMatchObject({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      title: "Untitled",
      description: "Add description",
      dueDate: null,
      status: TASK_STATUS.DRAFT,
      trelloCardId: null,
    });
    expect(result.task.id).toBe("00000000-0000-4000-8000-000000000011");
  });

  it("returns the task with a generated id when the repo assigns one", async () => {
    const saved = Task.create({
      id: "00000000-0000-4000-8000-000000000022",
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      title: "Untitled",
      description: "Add description",
    });
    const repository: AddManualTaskRepository = {
      save: vi.fn().mockResolvedValue(saved),
    };
    const useCase = new AddManualTaskUseCase(repository);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
    });

    expect(result.task.id).toBe("00000000-0000-4000-8000-000000000022");
  });
});
