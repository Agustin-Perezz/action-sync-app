import { expect, test } from "./_shared/app-fixtures";

test("home page loads and shows heading", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toBeVisible();
});
