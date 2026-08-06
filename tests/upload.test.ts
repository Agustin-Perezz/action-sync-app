import { expect, test } from "./_shared/app-fixtures";

test("upload dashboard shows heading, dropzone, textarea and extract button", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "New Transcript" }),
  ).toBeVisible();
  await expect(
    page.getByText("Drag a .txt file or click to browse"),
  ).toBeVisible();
  await expect(
    page.getByPlaceholder("Paste your meeting transcript here…"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Extract Tasks" }),
  ).toBeVisible();
});

test("extract button shows loading state then navigates to review", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Extract Tasks" }).click();

  await expect(page.getByRole("button", { name: "Extracting…" })).toBeVisible();

  await page.waitForURL("/review", { timeout: 5000 });

  await expect(
    page.getByRole("heading", { name: "Review extracted tasks" }),
  ).toBeVisible();
});
