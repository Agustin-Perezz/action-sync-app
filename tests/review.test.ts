import { expect, test } from "./_shared/app-fixtures";

const INITIAL_TASK_COUNT = 5;
const FIRST_TASK_TITLE = "Send Q2 roadmap draft to stakeholders";

test("review page shows heading, task count badge and initial tasks", async ({
  page,
}) => {
  await page.goto("/review");

  await expect(
    page.getByRole("heading", { name: "Review extracted tasks" }),
  ).toBeVisible();
  await expect(page.getByText(`${INITIAL_TASK_COUNT} tasks`)).toBeVisible();

  const titles = page.getByTestId("task-title-input");
  await expect(titles).toHaveCount(INITIAL_TASK_COUNT);
  await expect(titles.first()).toHaveValue(FIRST_TASK_TITLE);
});

test("user can delete a task and the count decreases", async ({ page }) => {
  await page.goto("/review");

  await expect(page.getByText(`${INITIAL_TASK_COUNT} tasks`)).toBeVisible();

  await page.getByRole("button", { name: "Delete task" }).first().click();

  await expect(page.getByText(`${INITIAL_TASK_COUNT - 1} tasks`)).toBeVisible();
  await expect(page.getByTestId("task-title-input")).toHaveCount(
    INITIAL_TASK_COUNT - 1,
  );
});

test("user can add a manual task", async ({ page }) => {
  await page.goto("/review");

  await expect(page.getByText(`${INITIAL_TASK_COUNT} tasks`)).toBeVisible();

  await page.getByRole("button", { name: "Add Manual Task" }).click();

  await expect(page.getByText(`${INITIAL_TASK_COUNT + 1} tasks`)).toBeVisible();
  await expect(page.getByTestId("task-title-input")).toHaveCount(
    INITIAL_TASK_COUNT + 1,
  );
});

test("user can edit a task title", async ({ page }) => {
  await page.goto("/review");

  const titleInput = page.getByTestId("task-title-input").first();
  await titleInput.fill("Updated title from E2E");

  await expect(titleInput).toHaveValue("Updated title from E2E");
});

test("user can change the target board", async ({ page }) => {
  await page.goto("/review");

  await page.getByRole("button", { name: /Board/ }).click();
  await page.getByRole("menuitem", { name: "Marketing Sprint" }).click();

  await expect(
    page.getByRole("button", { name: /Marketing Sprint/ }),
  ).toBeVisible();
});

test("sync button shows loading state then resets", async ({ page }) => {
  await page.goto("/review");

  await page.getByRole("button", { name: "Sync to Trello" }).click();

  await expect(
    page.getByRole("button", { name: "Sync to Trello" }),
  ).toBeDisabled();

  await expect(
    page.getByRole("button", { name: "Sync to Trello" }),
  ).toBeEnabled({ timeout: 5000 });
});
