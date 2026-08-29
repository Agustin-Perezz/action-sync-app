"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaskCardActions } from "./TaskCardActions";
import { TaskDescription } from "./TaskDescription";
import { TaskDueDate } from "./TaskDueDate";
import { TaskTitleInput } from "./TaskTitleInput";
import type { TaskCardProps } from "./task-card-props";

export function TaskCard({
  task,
  isEditing,
  editingTask,
  isSaving,
  saveError,
  onStartEdit,
  onEditField,
  onCancelEdit,
  onSave,
  onDelete,
}: TaskCardProps) {
  const displayTask = isEditing && editingTask ? editingTask : task;

  return (
    <Card className="rounded-2xl" data-testid="task-card">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <TaskTitleInput
            task={displayTask}
            onChange={onEditField}
            onFocus={() => !isEditing && onStartEdit(task)}
            readOnly={isSaving}
          />
          <TaskCardActions
            isEditing={isEditing}
            isSaving={isSaving}
            onSave={onSave}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
          />
        </div>
        <TaskDescription
          task={displayTask}
          onChange={onEditField}
          onFocus={() => !isEditing && onStartEdit(task)}
          readOnly={isSaving}
        />
        <TaskDueDate
          task={displayTask}
          onChange={onEditField}
          onFocus={() => !isEditing && onStartEdit(task)}
          readOnly={isSaving}
        />
        {isEditing && saveError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {saveError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
