import { expect, test } from "./_shared/app-fixtures";
import {
  cleanupTestData,
  seedTranscriptWithTasks,
} from "./_shared/fixtures/seed-helpers";

const RUN_ID = crypto.randomUUID();

test("review page shows seeded tasks for the authenticated user", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  const { transcript } = await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-show`,
    ["Review DB Task A", "Review DB Task B"],
  );

  try {
    await authenticatedPage.goto(`/review?transcript=${transcript.id}`);

    await expect(
      authenticatedPage.getByRole("heading", {
        name: "Review extracted tasks",
      }),
    ).toBeVisible();
    await expect(authenticatedPage.getByText("2 tasks")).toBeVisible();

    // Both seeded task titles should render in the page
    await expect(
      authenticatedPage
        .locator("input[data-testid='task-title-input']")
        .filter({
          hasText: "",
        }),
    ).toHaveCount(2);
    await expect(
      authenticatedPage.locator(
        "input[data-testid='task-title-input'][value='Review DB Task A']",
      ),
    ).toHaveCount(1);
    await expect(
      authenticatedPage.locator(
        "input[data-testid='task-title-input'][value='Review DB Task B']",
      ),
    ).toHaveCount(1);
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("add manual task button creates a task in the database", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  const { transcript } = await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-add`,
    ["Existing Task"],
  );

  try {
    await authenticatedPage.goto(`/review?transcript=${transcript.id}`);

    await expect(
      authenticatedPage.locator(
        "input[data-testid='task-title-input'][value='Existing Task']",
      ),
    ).toBeVisible();

    await authenticatedPage
      .getByRole("button", { name: "Add Manual Task" })
      .click();

    // A new empty task input should appear
    await expect(authenticatedPage.getByTestId("task-title-input")).toHaveCount(
      2,
    );

    // Verify the task was created in the DB
    const { data: dbTasks } = await supabaseTest
      .from("tasks")
      .select()
      .eq("transcript_id", transcript.id)
      .eq("user_id", testUser.id);

    expect(dbTasks).toHaveLength(2);
    expect(dbTasks?.some((t) => t.title === "Untitled")).toBe(true);
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("delete task removes the row from the database", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  const { transcript } = await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-delete`,
    ["Task To Delete", "Task To Keep"],
  );

  try {
    await authenticatedPage.goto(`/review?transcript=${transcript.id}`);

    // Delete the first task
    const firstCard = authenticatedPage.getByTestId("task-card").first();
    await firstCard.getByRole("button", { name: "Delete task" }).click();

    // UI: only one task input remains
    await expect(authenticatedPage.getByTestId("task-title-input")).toHaveCount(
      1,
    );

    // Wait for the server action to complete — the delete is fire-and-forget
    // in the hook, so we poll the DB until only 1 row remains.
    await expect
      .poll(
        async () => {
          const { data } = await supabaseTest
            .from("tasks")
            .select()
            .eq("transcript_id", transcript.id)
            .eq("user_id", testUser.id);
          return data?.length ?? 0;
        },
        { timeout: 5000 },
      )
      .toBe(1);

    // DB: the deleted task is gone, the kept task remains
    const { data: dbTasks } = await supabaseTest
      .from("tasks")
      .select()
      .eq("transcript_id", transcript.id)
      .eq("user_id", testUser.id);

    expect(dbTasks).toHaveLength(1);
    expect(dbTasks?.[0].title).toBe("Task To Keep");
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});

test("edit task title saves to the database", async ({
  authenticatedPage,
  testUser,
  supabaseTest,
}) => {
  const { transcript } = await seedTranscriptWithTasks(
    supabaseTest,
    testUser.id,
    `${RUN_ID}-edit`,
    ["Original Title"],
  );

  try {
    await authenticatedPage.goto(`/review?transcript=${transcript.id}`);

    const titleInput = authenticatedPage
      .getByTestId("task-title-input")
      .first();

    // Focus to enter edit mode
    await titleInput.focus();
    await titleInput.fill("Edited Title DB");

    // Save
    await authenticatedPage.getByRole("button", { name: "Save task" }).click();

    // Wait for the save to complete — edit buttons disappear
    await expect(
      authenticatedPage.getByRole("button", { name: "Save task" }),
    ).toHaveCount(0);

    // Verify the title was persisted in the DB
    const { data: dbTask } = await supabaseTest
      .from("tasks")
      .select()
      .eq("transcript_id", transcript.id)
      .eq("user_id", testUser.id)
      .single();

    expect(dbTask?.title).toBe("Edited Title DB");
  } finally {
    await cleanupTestData(supabaseTest, testUser.id);
  }
});
