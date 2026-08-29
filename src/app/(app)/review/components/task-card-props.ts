import type { Task } from "../types";

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

export type TaskCardActionsProps = {
  readonly isEditing: boolean;
  readonly isSaving: boolean;
  readonly onSave: () => void;
  readonly onCancelEdit: () => void;
  readonly onDelete: () => void;
};
