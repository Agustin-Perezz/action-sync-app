import { expect, test } from "./_shared/app-fixtures";

test("books page loads and shows heading", async ({ page }) => {
  await page.goto("/books");

  await expect(page.getByRole("heading", { name: "Books" })).toBeVisible();
  await expect(page.getByPlaceholder("Title")).toBeVisible();
  await expect(page.getByPlaceholder("Author")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
});

test("user can create a book via the form", async ({ page }) => {
  const title = `E2E Book ${Date.now()}`;
  const author = `E2E Author ${Date.now()}`;

  await page.goto("/books");

  await page.getByPlaceholder("Title").fill(title);
  await page.getByPlaceholder("Author").fill(author);
  await page.getByRole("button", { name: "Add" }).click();

  await page.waitForURL("/books");

  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText(author)).toBeVisible();
});
