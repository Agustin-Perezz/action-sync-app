"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "../types";
import { TaskDescription } from "./TaskDescription";
import { TaskDueDate } from "./TaskDueDate";
import { TaskTitleInput } from "./TaskTitleInput";

export type TaskCardProps = {
  readonly task: Task;
  readonly onChange: (updated: Task) => void;
  readonly onDelete: () => void;
};

export function TaskCard({ task, onChange, onDelete }: TaskCardProps) {
  return (
    <Card className="rounded-2xl" data-testid="task-card">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <TaskTitleInput task={task} onChange={onChange} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label="Delete task"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
        <TaskDescription task={task} onChange={onChange} />
        <TaskDueDate task={task} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
