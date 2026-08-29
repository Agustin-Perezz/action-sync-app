import { Textarea } from "@/components/ui/textarea";

export type TranscriptInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function TranscriptInput({ value, onChange }: TranscriptInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="transcript-text"
        className="text-sm font-medium text-muted-foreground"
      >
        Or paste transcript text
      </label>
      <Textarea
        id="transcript-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste your meeting transcript here…"
        className="min-h-[160px] bg-card"
      />
    </div>
  );
}
