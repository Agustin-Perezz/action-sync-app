"use client";

import type { Task } from "../types";
import { TaskCard } from "./TaskCard";

export type TaskListProps = {
  readonly tasks: readonly Task[];
  readonly onChange: (updated: Task) => void;
  readonly onDelete: (id: string) => void;
};

export function TaskList({ tasks, onChange, onDelete }: TaskListProps) {
  return (
    <>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onChange={onChange}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </>
  );
}
