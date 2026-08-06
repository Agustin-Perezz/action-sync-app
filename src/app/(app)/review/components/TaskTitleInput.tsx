"use client";

import { Input } from "@/components/ui/input";
import type { Task } from "../types";

export type TaskTitleInputProps = {
  readonly task: Task;
  readonly onChange: (updated: Task) => void;
};

export function TaskTitleInput({ task, onChange }: TaskTitleInputProps) {
  return (
    <Input
      value={task.title}
      onChange={(event) => onChange({ ...task, title: event.target.value })}
      placeholder="Task title"
      data-testid="task-title-input"
      className="h-7 border-transparent bg-transparent px-1 text-sm font-medium shadow-none focus-visible:border-ring focus-visible:bg-transparent"
    />
  );
}
