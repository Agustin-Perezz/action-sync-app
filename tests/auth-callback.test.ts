import { expect, test } from "./_shared/app-fixtures";

// The auth callback route always redirects to HOME_PATH ("/") whether or not a
// code is present. Tests use authenticatedPage so the final landing on "/" is
// not bounced back to /signin by the (app) layout guard.

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
