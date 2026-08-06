"use client";

import { useState } from "react";

import { SettingsHeader } from "./SettingsHeader";
import { TrelloIntegrationCard } from "./TrelloIntegrationCard";

export function SettingsWorkspace() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <SettingsHeader />
      <TrelloIntegrationCard
        connected={connected}
        onToggle={() => setConnected((prev) => !prev)}
      />
    </div>
  );
}
