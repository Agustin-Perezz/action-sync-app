import { expect, test } from "./_shared/app-fixtures";

// The extract flow calls the real OpenAI-backed extract-tasks use case and
// requires auth + a network stub for the AI adapter. That happy-path is out of
// scope for the MVP E2E suite (see task 8.2). Here we assert the upload
// surface renders.

test("upload dashboard shows heading, dropzone, textarea and extract button", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");

  await expect(
    authenticatedPage.getByRole("heading", { name: "New Transcript" }),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByText("Drag a .txt file or click to browse"),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByPlaceholder("Paste your meeting transcript here…"),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByRole("button", { name: "Extract Tasks" }),
  ).toBeVisible();
});

test("upload page shows Trello connection banner when not connected", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");

  await expect(
    authenticatedPage.getByText(
      "Trello not connected — link your account in Settings to sync tasks.",
    ),
  ).toBeVisible();
});

test("upload page shows sidebar with navigation items", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");

  // Desktop sidebar (aside) contains the nav links
  const sidebar = authenticatedPage.locator("aside");
  await expect(
    sidebar.getByRole("link", { name: "New Transcript" }),
  ).toBeVisible();
  await expect(
    sidebar.getByRole("link", { name: "Sync History" }),
  ).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Settings" })).toBeVisible();
});
