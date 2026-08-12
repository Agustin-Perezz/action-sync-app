import { expect, test } from "./_shared/app-fixtures";

// All routes under the (app) group are protected by requireUser() in the
// layout. Unauthenticated visitors must be redirected to /signin.

const PROTECTED_ROUTES = ["/", "/history", "/settings", "/review"] as const;

for (const route of PROTECTED_ROUTES) {
  test(`unauthenticated visit to ${route} redirects to /signin`, async ({
    page,
  }) => {
    await page.goto(route);

    await expect(page).toHaveURL("/signin");
  });
}

test("unauthenticated visit to /review with transcript param redirects to signin", async ({
  page,
}) => {
  await page.goto("/review?transcript=abc-123");

  await expect(page).toHaveURL("/signin");
});
