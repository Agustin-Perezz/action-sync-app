import { Check } from "lucide-react";

export type ConnectionBadgeProps = {
  readonly memberName: string | null;
};

export function ConnectionBadge({ memberName }: ConnectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <Check className="size-3" />
      {memberName ? `Connected as ${memberName}` : "Connected"}
    </span>
  );
}
