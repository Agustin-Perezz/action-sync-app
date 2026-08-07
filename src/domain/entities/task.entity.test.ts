import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./errors";
import { Task } from "./task.entity";
import { TASK_STATUS } from "./task-status.enum";

describe("Task", () => {
  it("creates a task with defaults for id, status, dueDate, trelloCardId, and createdAt", () => {
    const task = Task.create({
      transcriptId: "00000000-0000-4000-8000-000000000001",
      userId: "00000000-0000-4000-8000-000000000002",
      title: "Send invoice",
      description: "Email vendor",
    });

    const obj = task.toObject();
    expect(obj.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(obj.transcriptId).toBe("00000000-0000-4000-8000-000000000001");
    expect(obj.userId).toBe("00000000-0000-4000-8000-000000000002");
    expect(obj.title).toBe("Send invoice");
    expect(obj.description).toBe("Email vendor");
    expect(obj.dueDate).toBeNull();
    expect(obj.status).toBe(TASK_STATUS.DRAFT);
    expect(obj.trelloCardId).toBeNull();
    expect(obj.createdAt).toBe(new Date(obj.createdAt).toISOString());
  });

  it("preserves an explicit dueDate, trelloCardId, status, and createdAt", () => {
    const task = Task.create({
      id: "00000000-0000-4000-8000-000000000003",
      transcriptId: "00000000-0000-4000-8000-000000000004",
      userId: "00000000-0000-4000-8000-000000000005",
      title: "Review PR",
      description: "Approve if green",
      dueDate: "2026-02-01T00:00:00.000Z",
      status: TASK_STATUS.SYNCED,
      trelloCardId: "card-123",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(task.toObject()).toEqual({
      id: "00000000-0000-4000-8000-000000000003",
      transcriptId: "00000000-0000-4000-8000-000000000004",
      userId: "00000000-0000-4000-8000-000000000005",
      title: "Review PR",
      description: "Approve if green",
      dueDate: "2026-02-01T00:00:00.000Z",
      status: TASK_STATUS.SYNCED,
      trelloCardId: "card-123",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("rejects an empty title", () => {
    expect(() =>
      Task.create({
        transcriptId: "00000000-0000-4000-8000-000000000001",
        userId: "00000000-0000-4000-8000-000000000002",
        title: "",
        description: "desc",
      }),
    ).toThrow(InvalidTaskError);
  });

  it("rejects an empty description", () => {
    expect(() =>
      Task.create({
        transcriptId: "00000000-0000-4000-8000-000000000001",
        userId: "00000000-0000-4000-8000-000000000002",
        title: "Title",
        description: "",
      }),
    ).toThrow(InvalidTaskError);
  });

  it("accepts a null dueDate explicitly", () => {
    const task = Task.create({
      transcriptId: "00000000-0000-4000-8000-000000000001",
      userId: "00000000-0000-4000-8000-000000000002",
      title: "No due date",
      description: "desc",
      dueDate: null,
    });

    expect(task.toObject().dueDate).toBeNull();
  });

  it("accepts a null trelloCardId explicitly", () => {
    const task = Task.create({
      transcriptId: "00000000-0000-4000-8000-000000000001",
      userId: "00000000-0000-4000-8000-000000000002",
      title: "Not synced",
      description: "desc",
      trelloCardId: null,
    });

    expect(task.toObject().trelloCardId).toBeNull();
  });
});
