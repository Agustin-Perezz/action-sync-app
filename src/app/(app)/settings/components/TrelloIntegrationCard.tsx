import { SquareKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrelloConnectionToggle } from "./TrelloConnectionToggle";

export type TrelloIntegrationCardProps = {
  readonly connected: boolean;
  readonly memberName: string | null;
};

export function TrelloIntegrationCard({
  connected,
  memberName,
}: TrelloIntegrationCardProps) {
  return (
    <Card className="rounded-3xl bg-secondary ring-1 ring-border">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <SquareKanban className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <CardTitle>Trello</CardTitle>
            <p className="text-sm text-muted-foreground">
              Connect your Trello account to sync extracted tasks to your
              boards.
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center justify-between gap-3 py-5">
        <TrelloConnectionToggle connected={connected} memberName={memberName} />
      </CardContent>
    </Card>
  );
}
