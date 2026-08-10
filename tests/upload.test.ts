import { expect, test } from "./_shared/app-fixtures";

// The extract flow calls the real OpenAI-backed extract-tasks use case and
// requires auth + a network stub for the AI adapter. That happy-path is out of
// scope for the MVP E2E suite (see task 8.2). Here we assert the upload
// surface renders.

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
