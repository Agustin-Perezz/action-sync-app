import { expect, test } from "./_shared/app-fixtures";

test("trello callback with no token in hash shows error", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/trello/callback");

  await expect(
    authenticatedPage.getByText("No token found in URL."),
  ).toBeVisible();
});

test("trello callback with empty hash shows error", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/trello/callback#");

  await expect(
    authenticatedPage.getByText("No token found in URL."),
  ).toBeVisible();
});

test("trello callback with fake token shows connecting then error", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/trello/callback#token=fake-token");

  await expect(
    authenticatedPage.getByText("Trello connection failed. Please try again."),
  ).toBeVisible({ timeout: 5000 });
});
