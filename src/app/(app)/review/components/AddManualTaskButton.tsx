"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export type AddManualTaskButtonProps = {
  readonly onAdd: () => void;
};

export function AddManualTaskButton({ onAdd }: AddManualTaskButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onAdd}
      className="h-10 gap-2 border-dashed"
    >
      <Plus className="size-4" />
      Add Manual Task
    </Button>
  );
}
