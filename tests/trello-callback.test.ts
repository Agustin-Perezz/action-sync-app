import { expect, test } from "./_shared/app-fixtures";

// Trello callback is a client component that reads #token= from the URL hash.
// Without a token it shows an error. With a token it calls connectTrello which
// requires real Trello API access — out of scope for E2E.

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

  // The fake token triggers connectTrello server action which will fail
  // because it's not a real Trello token.
  await expect(
    authenticatedPage.getByText("Trello connection failed. Please try again."),
  ).toBeVisible({ timeout: 5000 });
});
