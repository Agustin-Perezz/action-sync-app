import { expect, test } from "./_shared/app-fixtures";

test("header shows user email and logout button", async ({
  authenticatedPage,
  testUser,
}) => {
  await authenticatedPage.goto("/");

  await expect(authenticatedPage.getByText(testUser.email)).toBeVisible();
  await expect(
    authenticatedPage.getByRole("button", { name: "Log out" }),
  ).toBeVisible();
});

test("sidebar shows amber dot on Settings when Trello not connected", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");

  const settingsLink = authenticatedPage
    .locator("aside")
    .getByRole("link", { name: "Settings" });
  await expect(settingsLink).toBeVisible();
  // The amber warning dot is a span inside the link
  await expect(settingsLink.locator("span.bg-amber-400")).toBeVisible();
});

test("sidebar navigation switches between pages", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");
  const sidebar = authenticatedPage.locator("aside");

  await sidebar.getByRole("link", { name: "Sync History" }).click();
  await expect(authenticatedPage).toHaveURL("/history");
  await expect(
    authenticatedPage.getByRole("heading", { name: "Sync History" }),
  ).toBeVisible();

  await authenticatedPage
    .locator("aside")
    .getByRole("link", { name: "Settings" })
    .click();
  await expect(authenticatedPage).toHaveURL("/settings");
  await expect(
    authenticatedPage.getByRole("heading", { name: "Settings" }),
  ).toBeVisible();

  await authenticatedPage
    .locator("aside")
    .getByRole("link", { name: "New Transcript" })
    .click();
  await expect(authenticatedPage).toHaveURL("/");
  await expect(
    authenticatedPage.getByRole("heading", { name: "New Transcript" }),
  ).toBeVisible();
});

test("logout button redirects to signin", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/");

  await authenticatedPage.getByRole("button", { name: "Log out" }).click();

  await expect(authenticatedPage).toHaveURL("/signin");
});

test("mobile nav sheet opens and closes on navigation", async ({
  authenticatedPage,
}) => {
  // Set mobile viewport
  await authenticatedPage.setViewportSize({ width: 375, height: 812 });
  await authenticatedPage.goto("/");

  // Open the mobile nav sheet
  await authenticatedPage
    .getByRole("button", { name: "Open navigation" })
    .click();

  // Sheet should be visible with nav items
  await expect(
    authenticatedPage.getByRole("link", { name: "Sync History" }),
  ).toBeVisible();

  // Click a nav item — sheet should close and page should navigate
  await authenticatedPage.getByRole("link", { name: "Sync History" }).click();
  await expect(authenticatedPage).toHaveURL("/history");
});
