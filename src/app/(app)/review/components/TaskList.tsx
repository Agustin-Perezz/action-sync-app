"use client";

import type { Task } from "../types";
import { TaskCard } from "./TaskCard";

export type TaskListProps = {
  readonly tasks: readonly Task[];
  readonly editingTask: Task | null;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly onStartEdit: (task: Task) => void;
  readonly onEditField: (updated: Task) => void;
  readonly onCancelEdit: () => void;
  readonly onSave: () => void;
  readonly onDelete: (id: string) => void;
};

export function TaskList({
  tasks,
  editingTask,
  isSaving,
  saveError,
  onStartEdit,
  onEditField,
  onCancelEdit,
  onSave,
  onDelete,
}: TaskListProps) {
  return (
    <>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingTask?.id === task.id}
          editingTask={editingTask}
          isSaving={isSaving}
          saveError={editingTask?.id === task.id ? saveError : null}
          onStartEdit={onStartEdit}
          onEditField={onEditField}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </>
  );
}
