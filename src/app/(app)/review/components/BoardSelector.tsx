"use client";

import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BoardSelectorOption = { id: string; name: string };

export type BoardSelectorProps = {
  readonly label: string;
  readonly value: string | null;
  readonly options: readonly BoardSelectorOption[];
  readonly onSelect: (id: string) => void;
};

export function BoardSelector({
  label,
  value,
  options,
  onSelect,
}: BoardSelectorProps) {
  const selectedName = options.find((option) => option.id === value)?.name;
  const display = selectedName ?? label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="gap-1.5" />}
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{display}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="justify-between"
          >
            {option.name}
            {option.id === value && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
