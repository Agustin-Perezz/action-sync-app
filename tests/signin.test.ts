import { expect, test } from "./_shared/app-fixtures";

test("signin page renders all elements", async ({ page }) => {
  await page.goto("/signin");

  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  await expect(page.getByText("Sign in to continue")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send Magic Link" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  await expect(page.getByText("Or continue with")).toBeVisible();
});

test("magic link with valid email shows success message", async ({ page }) => {
  await page.goto("/signin");

  await page.getByLabel("Email").fill(`e2e-${crypto.randomUUID()}@test.com`);
  await page.getByRole("button", { name: "Send Magic Link" }).click();

  await expect(
    page.getByText("Check your email for the sign-in link."),
  ).toBeVisible();
});

test("signin page does not show app sidebar", async ({ page }) => {
  await page.goto("/signin");

  await expect(page.getByText("ActionSync")).toHaveCount(0);
});
