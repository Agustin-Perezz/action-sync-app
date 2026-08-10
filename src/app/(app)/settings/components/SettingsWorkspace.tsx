import { getUser } from "@/lib/shared/infrastructure/auth.server";
import { getTrelloConnection } from "../actions";
import { SettingsHeader } from "./SettingsHeader";
import { TrelloIntegrationCard } from "./TrelloIntegrationCard";

export async function SettingsWorkspace() {
  const user = await getUser();
  // Anonymous visitors see the disconnected state; the connect action enforces auth.
  const connection = user
    ? await getTrelloConnection()
    : { connected: false, memberName: null, trelloMemberId: null };

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <SettingsHeader />
      <TrelloIntegrationCard
        connected={connection.connected}
        memberName={connection.memberName}
      />
    </div>
  );
}
