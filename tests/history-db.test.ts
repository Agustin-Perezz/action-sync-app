import { expect, test } from "./_shared/app-fixtures";
import {
  cleanupTestData,
  seedTranscriptWithTasks,
} from "./_shared/fixtures/seed-helpers";

const RUN_ID = crypto.randomUUID();

test("history page shows seeded transcripts with task counts and status", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-hist-1`,
    ["Task 1", "Task 2", "Task 3"],
    "reviewing",
  );
  await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-hist-2`,
    ["Task 4"],
    "completed",
  );

  try {
    await authenticatedPage.goto("/history");

    await expect(
      authenticatedPage.getByText(`${RUN_ID}-hist-1-transcript`),
    ).toBeVisible();
    await expect(
      authenticatedPage.getByText(`${RUN_ID}-hist-2-transcript`),
    ).toBeVisible();

    await expect(authenticatedPage.getByText("3 tasks")).toBeVisible();
    await expect(authenticatedPage.getByText("1 tasks")).toBeVisible();

    await expect(authenticatedPage.getByText("Pending").first()).toBeVisible();
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("history page links to review page with transcript id", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  const { transcript } = await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-link`,
    ["Task 1"],
    "reviewing",
  );

  try {
    await authenticatedPage.goto("/history");

    await authenticatedPage
      .getByRole("link", { name: `${RUN_ID}-link-transcript` })
      .click();

    await expect(authenticatedPage).toHaveURL(
      `/review?transcript=${transcript.id}`,
    );
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("history page shows empty state when user has no transcripts", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/history");

  await expect(authenticatedPage.getByText("No syncs yet")).toBeVisible();
  await expect(
    authenticatedPage.getByText("Upload a transcript to get started."),
  ).toBeVisible();
});
