import { expect, test } from "./_shared/app-fixtures";

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

test("trello starts disconnected and can be connected", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByText("Not connected")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Connect Trello" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Connect Trello" }).click();

  await expect(page.getByText("Connected as Alex Carter")).toBeVisible();
  await expect(page.getByRole("button", { name: "Disconnect" })).toBeVisible();
});

test("user can disconnect after connecting", async ({ page }) => {
  await page.goto("/settings");

  await page.getByRole("button", { name: "Connect Trello" }).click();
  await expect(page.getByText("Connected as Alex Carter")).toBeVisible();

  await page.getByRole("button", { name: "Disconnect" }).click();

  await expect(page.getByText("Not connected")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Connect Trello" }),
  ).toBeVisible();
});
