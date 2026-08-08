import { describe, expect, it, vi } from "vitest";
import { InvalidTaskError, TaskNotFoundError } from "@/domain/entities/errors";
import { Task } from "@/domain/entities/task.entity";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { UpdateTaskRepository } from "./update-task.repository.interface";
import { UpdateTaskUseCase } from "./update-task.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const OTHER_USER_ID = "00000000-0000-4000-8000-000000000099";
const TASK_ID = "00000000-0000-4000-8000-000000000011";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";

function makeDraftTask(overrides: Partial<Task> = {}): Task {
  return Task.create({
    id: overrides.id ?? TASK_ID,
    transcriptId: TRANSCRIPT_ID,
    userId: overrides.userId ?? USER_ID,
    title: overrides.title ?? "Original task",
    description: overrides.description ?? "Original desc",
    dueDate: overrides.dueDate ?? null,
    status: overrides.status ?? TASK_STATUS.DRAFT,
    trelloCardId: overrides.trelloCardId ?? null,
  });
}

describe("UpdateTaskUseCase", () => {
  it("updates the title and description of a draft task", async () => {
    const task = makeDraftTask();
    const updated = makeDraftTask({
      title: "Edited task",
      description: "Edited desc",
    });
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      update: vi.fn().mockResolvedValue(updated),
    };
    const useCase = new UpdateTaskUseCase(repository);

    const result = await useCase.execute({
      id: TASK_ID,
      userId: USER_ID,
      title: "Edited task",
      description: "Edited desc",
    });

    expect(repository.update).toHaveBeenCalledWith(TASK_ID, {
      title: "Edited task",
      description: "Edited desc",
    });
    expect(result).toEqual({ task: updated });
  });

  it("updates only the dueDate when it is the only provided field", async () => {
    const task = makeDraftTask();
    const updated = makeDraftTask({ dueDate: "2026-03-01" });
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      update: vi.fn().mockResolvedValue(updated),
    };
    const useCase = new UpdateTaskUseCase(repository);

    await useCase.execute({
      id: TASK_ID,
      userId: USER_ID,
      dueDate: "2026-03-01",
    });

    expect(repository.update).toHaveBeenCalledWith(TASK_ID, {
      dueDate: "2026-03-01",
    });
  });

  it("clears dueDate when null is passed", async () => {
    const task = makeDraftTask({ dueDate: "2026-03-01" });
    const updated = makeDraftTask({ dueDate: null });
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      update: vi.fn().mockResolvedValue(updated),
    };
    const useCase = new UpdateTaskUseCase(repository);

    await useCase.execute({ id: TASK_ID, userId: USER_ID, dueDate: null });

    expect(repository.update).toHaveBeenCalledWith(TASK_ID, { dueDate: null });
  });

  it("rejects updating a synced task", async () => {
    const task = makeDraftTask({ status: TASK_STATUS.SYNCED });
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      update: vi.fn(),
    };
    const useCase = new UpdateTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID, title: "New" }),
    ).rejects.toThrow(InvalidTaskError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("rejects updating a task owned by another user", async () => {
    const task = makeDraftTask({ userId: OTHER_USER_ID });
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(task),
      update: vi.fn(),
    };
    const useCase = new UpdateTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID, title: "New" }),
    ).rejects.toThrow(TaskNotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("rejects updating a non-existent task", async () => {
    const repository: UpdateTaskRepository = {
      findById: vi.fn().mockResolvedValue(null),
      update: vi.fn(),
    };
    const useCase = new UpdateTaskUseCase(repository);

    await expect(
      useCase.execute({ id: TASK_ID, userId: USER_ID, title: "New" }),
    ).rejects.toThrow(TaskNotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
