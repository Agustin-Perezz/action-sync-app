import { expect, test } from "./_shared/app-fixtures";

test("home page loads and shows heading", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/");

  await expect(
    authenticatedPage.getByRole("heading", { name: "New Transcript" }),
  ).toBeVisible();
});
