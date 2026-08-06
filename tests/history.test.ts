import { expect, test } from "./_shared/app-fixtures";

const FIRST_FILE_NAME = "standup-2026-03-12.txt";
const HISTORY_ENTRY_COUNT = 5;

test("sync history page shows heading and mock entries", async ({ page }) => {
  await page.goto("/history");

  await expect(
    page.getByRole("heading", { name: "Sync History" }),
  ).toBeVisible();
  await expect(page.getByText(FIRST_FILE_NAME).first()).toBeVisible();
  await expect(
    page.getByText("→ Product Roadmap / To Do").first(),
  ).toBeVisible();
});

test("history rows show status pills", async ({ page }) => {
  await page.goto("/history");

  await expect(page.getByText("Synced", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Failed", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Pending", { exact: true }).first(),
  ).toBeVisible();
});

test("history shows the expected number of file entries", async ({ page }) => {
  await page.goto("/history");

  await expect(page.getByText(/\.txt$/)).toHaveCount(HISTORY_ENTRY_COUNT);
});
