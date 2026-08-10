import { expect, test } from "./_shared/app-fixtures";

// E2E runs authenticated against local Supabase with no seeded transcript, so
// the review page shows its empty state. The task mutation/sync flows need a
// seeded transcript + Trello connection and are out of scope for the MVP E2E
// suite (see task 8.2).

test("review page shows heading and zero-task state for authenticated visitor", async ({
  page,
}) => {
  await page.goto("/review");

  await expect(
    page.getByRole("heading", { name: "Review extracted tasks" }),
  ).toBeVisible();
  await expect(page.getByText("0 tasks")).toBeVisible();
  await expect(page.getByTestId("task-title-input")).toHaveCount(0);
});
