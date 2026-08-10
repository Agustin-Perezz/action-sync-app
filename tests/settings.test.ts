import { expect, test } from "./_shared/app-fixtures";

// E2E runs anonymous against local Supabase. getTrelloConnection returns the
// row state (none for anonymous), so the disconnected state is the initial
// surface. The connect flow is a real Trello OAuth redirect — it needs Trello
// network stubs and is out of scope for the MVP E2E suite (see task 8.2).

test("settings page shows heading and Trello card", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByText("Trello", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Connect your Trello account to sync extracted tasks to your boards.",
    ),
  ).toBeVisible();
});

test("trello starts disconnected with a connect button", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByText("Not connected")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Connect Trello" }),
  ).toBeVisible();
});
