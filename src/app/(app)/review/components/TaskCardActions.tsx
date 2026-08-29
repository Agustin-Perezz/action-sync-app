import { Check, Loader2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TaskCardActionsProps } from "./task-card-props";

const ghostIcon = {
  variant: "ghost",
  size: "icon-sm",
} as const;

export function TaskCardActions({
  isEditing,
  isSaving,
  onSave,
  onCancelEdit,
  onDelete,
}: TaskCardActionsProps) {
  if (!isEditing) {
    return (
      <Button
        {...ghostIcon}
        onClick={onDelete}
        aria-label="Delete task"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        {...ghostIcon}
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
        {...ghostIcon}
        onClick={onCancelEdit}
        disabled={isSaving}
        aria-label="Cancel edit"
        className="text-muted-foreground hover:text-destructive"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
