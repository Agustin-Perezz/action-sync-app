"use client";

import { Textarea } from "@/components/ui/textarea";
import type { Task } from "../types";

export type TaskDescriptionProps = {
  readonly task: Task;
  readonly onChange: (updated: Task) => void;
  readonly onFocus?: () => void;
  readonly readOnly?: boolean;
};

export function TaskDescription({
  task,
  onChange,
  onFocus,
  readOnly,
}: TaskDescriptionProps) {
  return (
    <Textarea
      value={task.description}
      onChange={(event) =>
        onChange({ ...task, description: event.target.value })
      }
      onFocus={onFocus}
      readOnly={readOnly}
      placeholder="Add a description…"
      className="min-h-[60px] resize-none border-transparent bg-transparent px-1 text-sm text-muted-foreground shadow-none focus-visible:border-ring focus-visible:bg-transparent"
    />
  );
}
