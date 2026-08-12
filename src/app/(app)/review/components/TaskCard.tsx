"use client";

import { Check, Loader2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "../types";
import { TaskDescription } from "./TaskDescription";
import { TaskDueDate } from "./TaskDueDate";
import { TaskTitleInput } from "./TaskTitleInput";

export type TaskCardProps = {
  readonly task: Task;
  readonly isEditing: boolean;
  readonly editingTask: Task | null;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly onStartEdit: (task: Task) => void;
  readonly onEditField: (updated: Task) => void;
  readonly onCancelEdit: () => void;
  readonly onSave: () => void;
  readonly onDelete: () => void;
};

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
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onSave}
                disabled={isSaving}
                aria-label="Save task"
                className="text-muted-foreground hover:text-foreground"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onCancelEdit}
                disabled={isSaving}
                aria-label="Cancel edit"
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              aria-label="Delete task"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          )}
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
