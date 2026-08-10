import { Task } from "@/domain/entities/task.entity";
import type { TaskInsert, TaskRow } from "../entities/task.entity";

export const taskMapper = {
  toDomain(row: TaskRow): Task {
    return Task.create({
      id: row.id,
      transcriptId: row.transcript_id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      dueDate: row.due_date,
      status: row.status,
      trelloCardId: row.trello_card_id,
      createdAt: row.created_at,
    });
  },

  toPersistence(task: Task): TaskInsert {
    const props = task.toObject();
    return {
      id: props.id,
      transcript_id: props.transcriptId,
      user_id: props.userId,
      title: props.title,
      description: props.description,
      due_date: props.dueDate,
      status: props.status,
      trello_card_id: props.trelloCardId,
      created_at: props.createdAt,
    };
  },
};
