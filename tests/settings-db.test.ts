import { expect, test } from "./_shared/app-fixtures";
import {
  cleanupTestData,
  getTrelloConnectionFromDb,
  seedTrelloConnection,
} from "./_shared/fixtures/seed-helpers";

test("settings page shows connected state when trello_connection exists", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  await seedTrelloConnection(supabaseTest, testUser.id);

  try {
    await authenticatedPage.goto("/settings");

    // Should NOT show "Not connected"
    await expect(authenticatedPage.getByText("Not connected")).toHaveCount(0);

    // Should show Disconnect button
    await expect(
      authenticatedPage.getByRole("button", { name: "Disconnect" }),
    ).toBeVisible();
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("settings page hides Trello banner on upload page when connected", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  await seedTrelloConnection(supabaseTest, testUser.id);

  try {
    await authenticatedPage.goto("/");

    // Banner should NOT appear when connected
    await expect(
      authenticatedPage.getByText(
        "Trello not connected — link your account in Settings to sync tasks.",
      ),
    ).toHaveCount(0);
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("sidebar hides amber dot on Settings when Trello is connected", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  await seedTrelloConnection(supabaseTest, testUser.id);

  try {
    await authenticatedPage.goto("/");

    const settingsLink = authenticatedPage
      .locator("aside")
      .getByRole("link", { name: "Settings" });
    await expect(settingsLink).toBeVisible();
    // No amber dot when connected
    await expect(settingsLink.locator("span.bg-amber-400")).toHaveCount(0);
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("disconnect button removes trello_connection from the database", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  await seedTrelloConnection(supabaseTest, testUser.id);

  try {
    await authenticatedPage.goto("/settings");

    await authenticatedPage.getByRole("button", { name: "Disconnect" }).click();

    // UI switches back to disconnected state
    await expect(authenticatedPage.getByText("Not connected")).toBeVisible();
    await expect(
      authenticatedPage.getByRole("button", { name: "Connect Trello" }),
    ).toBeVisible();

    // DB: the connection row is gone
    const connection = await getTrelloConnectionFromDb(
      supabaseTest,
      testUser.id,
    );
    expect(connection).toBeNull();
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});
