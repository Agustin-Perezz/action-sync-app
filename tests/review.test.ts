import { expect, test } from "./_shared/app-fixtures";

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
