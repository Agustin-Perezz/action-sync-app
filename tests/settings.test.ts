import { expect, test } from "./_shared/app-fixtures";

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
