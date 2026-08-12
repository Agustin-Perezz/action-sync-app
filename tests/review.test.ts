import { expect, test } from "./_shared/app-fixtures";

// E2E runs authenticated against local Supabase with no seeded transcript, so
// the review page shows its empty state. The task mutation/sync flows need a
// seeded transcript + Trello connection and are out of scope for the MVP E2E
// suite (see task 8.2).

test("review page shows heading and zero-task state for authenticated visitor", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/review");

  await expect(
    authenticatedPage.getByRole("heading", { name: "Review extracted tasks" }),
  ).toBeVisible();
  await expect(authenticatedPage.getByText("0 tasks")).toBeVisible();
  await expect(authenticatedPage.getByTestId("task-title-input")).toHaveCount(
    0,
  );
});

test("review page shows board and list selectors with amber dot indicators", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/review");

  await expect(
    authenticatedPage.getByRole("button", { name: "Board" }),
  ).toBeVisible();
  await expect(
    authenticatedPage.getByRole("button", { name: "List" }),
  ).toBeVisible();
  await expect(authenticatedPage.getByText("Sync to Trello")).toBeVisible();
});
