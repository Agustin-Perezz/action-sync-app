import { describe, expect, it } from "vitest";
import { Task } from "@/domain/entities/task.entity";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { TaskRow } from "../entities/task.entity";
import { taskMapper } from "./task.mapper";

const row: TaskRow = {
  id: "00000000-0000-4000-8000-000000000001",
  transcript_id: "00000000-0000-4000-8000-000000000002",
  user_id: "00000000-0000-4000-8000-000000000003",
  title: "Send invoice",
  description: "Send the Q1 invoice to Acme",
  due_date: "2026-02-01",
  status: "draft",
  trello_card_id: null,
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("taskMapper", () => {
  it("maps a persistence row to a domain Task", () => {
    const task = taskMapper.toDomain(row);

    expect(task.id).toBe(row.id);
    expect(task.transcriptId).toBe(row.transcript_id);
    expect(task.userId).toBe(row.user_id);
    expect(task.title).toBe(row.title);
    expect(task.description).toBe(row.description);
    expect(task.dueDate).toBe(row.due_date);
    expect(task.status).toBe(row.status);
    expect(task.trelloCardId).toBe(row.trello_card_id);
    expect(task.createdAt).toBe(row.created_at);
  });

  it("maps a domain Task back to a persistence insert", () => {
    const task = taskMapper.toDomain(row);

    expect(taskMapper.toPersistence(task)).toEqual({
      id: row.id,
      transcript_id: row.transcript_id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      due_date: row.due_date,
      status: row.status,
      trello_card_id: row.trello_card_id,
      created_at: row.created_at,
    });
  });

  it("round-trips a Task through persistence without loss", () => {
    const task = taskMapper.toDomain(row);
    const inserted = taskMapper.toPersistence(task);

    const restored = taskMapper.toDomain({
      id: row.id,
      transcript_id: inserted.transcript_id,
      user_id: inserted.user_id,
      title: inserted.title ?? row.title,
      description: inserted.description ?? row.description,
      due_date: inserted.due_date ?? null,
      status: inserted.status ?? row.status,
      trello_card_id: inserted.trello_card_id ?? null,
      created_at: row.created_at,
    });

    expect(restored.toObject()).toEqual(task.toObject());
  });

  it("preserves a null dueDate and trelloCardId on the domain entity", () => {
    const task = Task.create({
      id: row.id,
      transcriptId: row.transcript_id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      dueDate: null,
      status: TASK_STATUS.DRAFT,
      trelloCardId: null,
      createdAt: row.created_at,
    });

    expect(task.toObject()).toEqual({
      id: row.id,
      transcriptId: row.transcript_id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      dueDate: null,
      status: "draft",
      trelloCardId: null,
      createdAt: row.created_at,
    });
  });
});
