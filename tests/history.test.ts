import { expect, test } from "./_shared/app-fixtures";

test("sync history page shows heading and empty state", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/history");

  await expect(
    authenticatedPage.getByRole("heading", { name: "Sync History" }),
  ).toBeVisible();
  await expect(authenticatedPage.getByText("No syncs yet")).toBeVisible();
  await expect(
    authenticatedPage.getByText("Upload a transcript to get started."),
  ).toBeVisible();
});
