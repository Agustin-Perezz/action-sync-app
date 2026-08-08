import { describe, expect, it, vi } from "vitest";
import { InvalidTaskError, TaskNotFoundError } from "@/domain/entities/errors";
import { Task } from "@/domain/entities/task.entity";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { DeleteTaskRepository } from "./delete-task.repository.interface";
import { DeleteTaskUseCase } from "./delete-task.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const OTHER_USER_ID = "00000000-0000-4000-8000-000000000099";
const TASK_ID = "00000000-0000-4000-8000-000000000011";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";

function makeDraftTask(overrides: Partial<Task> = {}): Task {
  return Task.create({
    id: overrides.id ?? TASK_ID,
    transcriptId: TRANSCRIPT_ID,
    userId: overrides.userId ?? USER_ID,
    title: overrides.title ?? "Draft task",
    description: "Some desc",
    status: overrides.status ?? TASK_STATUS.DRAFT,
  });
}

describe("DeleteTaskUseCase", () => {
  it("deletes a draft task owned by the user", async () => {
    const task = makeDraftTask();
    const remove = vi.fn().mockResolvedValue(undefined);
    const repository: DeleteTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      delete: remove,
    };
    const useCase = new DeleteTaskUseCase(repository);

    await useCase.execute({ id: TASK_ID, userId: USER_ID });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(TASK_ID);
  });

  it("rejects deleting a synced task", async () => {
    const task = makeDraftTask({ status: TASK_STATUS.SYNCED });
    const remove = vi.fn();
    const repository: DeleteTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      delete: remove,
    };
    const useCase = new DeleteTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID }),
    ).rejects.toThrow(InvalidTaskError);
    expect(remove).not.toHaveBeenCalled();
  });

  it("rejects deleting a task owned by another user", async () => {
    const task = makeDraftTask({ userId: OTHER_USER_ID });
    const remove = vi.fn();
    const repository: DeleteTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      delete: remove,
    };
    const useCase = new DeleteTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID }),
    ).rejects.toThrow(TaskNotFoundError);
    expect(remove).not.toHaveBeenCalled();
  });

  it("rejects deleting a non-existent task", async () => {
    const remove = vi.fn();
    const repository: DeleteTaskRepository = {
      findById: vi.fn().mockResolvedValue(null),
      delete: remove,
    };
    const useCase = new DeleteTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID }),
    ).rejects.toThrow(TaskNotFoundError);
    expect(remove).not.toHaveBeenCalled();
  });
});
