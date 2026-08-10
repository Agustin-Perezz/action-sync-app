import { expect, test } from "./_shared/app-fixtures";

// E2E runs authenticated against local Supabase with no seeded transcripts, so
// the history page shows its empty state. The rows/sync-pills flow needs a
// seeded transcript + Trello sync and is out of scope for the MVP E2E suite
// (task 8.2).

test("sync history page shows heading and empty state", async ({ page }) => {
  await page.goto("/history");

  await expect(
    page.getByRole("heading", { name: "Sync History" }),
  ).toBeVisible();
  await expect(page.getByText("No syncs yet")).toBeVisible();
  await expect(
    page.getByText("Upload a transcript to get started."),
  ).toBeVisible();
});
