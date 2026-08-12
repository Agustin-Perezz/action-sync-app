import { expect, test } from "./_shared/app-fixtures";

test("auth callback with no params redirects to home", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/auth/callback");

  await expect(authenticatedPage).toHaveURL("/");
});

test("auth callback with invalid code still redirects to home", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/auth/callback?code=invalid-code");

  await expect(authenticatedPage).toHaveURL("/");
});
