"use client";

import { Calendar } from "lucide-react";

import type { Task } from "../types";

export type TaskDueDateProps = {
  readonly task: Task;
  readonly onChange: (updated: Task) => void;
};

export function TaskDueDate({ task, onChange }: TaskDueDateProps) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Calendar className="size-3.5" />
      <input
        type="date"
        value={task.dueDate ?? ""}
        onChange={(event) =>
          onChange({ ...task, dueDate: event.target.value || null })
        }
        className="h-6 rounded-md border border-input bg-transparent px-1.5 text-xs text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  );
}
