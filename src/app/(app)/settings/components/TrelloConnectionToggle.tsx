import { ConnectedToggle } from "./ConnectedToggle";
import { DisconnectedToggle } from "./DisconnectedToggle";

export type TrelloConnectionToggleProps = {
  readonly connected: boolean;
  readonly memberName: string | null;
};

export function TrelloConnectionToggle({
  connected,
  memberName,
}: TrelloConnectionToggleProps) {
  return connected ? (
    <ConnectedToggle memberName={memberName} />
  ) : (
    <DisconnectedToggle />
  );
}
