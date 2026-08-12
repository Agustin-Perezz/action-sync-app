import { expect, test } from "./_shared/app-fixtures";

// E2E runs authenticated against local Supabase. getTrelloConnection returns
// no row for the test user, so the disconnected state is the initial surface.
// The connect flow is a real Trello OAuth redirect — it needs Trello network
// stubs and is out of scope for the MVP E2E suite (see task 8.2).

test("settings page shows heading and Trello card", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/settings");

  await expect(
    authenticatedPage.getByRole("heading", { name: "Settings" }),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByText("Trello", { exact: true }),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByText(
      "Connect your Trello account to sync extracted tasks to your boards.",
    ),
  ).toBeVisible();
});

test("trello starts disconnected with a connect button", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/settings");

  await expect(authenticatedPage.getByText("Not connected")).toBeVisible();
  await expect(
    authenticatedPage.getByRole("button", { name: "Connect Trello" }),
  ).toBeVisible();
});
