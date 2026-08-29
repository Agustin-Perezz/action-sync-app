import { test as base, expect, type Page } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

import {
  createTestUser,
  deleteTestUser,
  signInAndGetCookies,
  type TestUser,
} from "./fixtures/auth-fixtures";
import { supabaseTestClient } from "./fixtures/supabase-test-client";

const CHROMIUM_PROJECT = "chromium";

const test = base.extend<{
  supabaseTest: typeof supabaseTestClient;
  testUser: TestUser;
  authenticatedPage: Page;
}>({
  supabaseTest: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright requires destructuring pattern
    async ({}, use) => {
      await use(supabaseTestClient);
    },
    { auto: true },
  ],

  testUser: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright requires destructuring pattern
    async ({}, use) => {
      const user = await createTestUser(supabaseTestClient);
      await use(user);
      await deleteTestUser(supabaseTestClient, user.id);
    },
    { scope: "test" },
  ],

  authenticatedPage: async ({ browser, testUser }, use, testInfo) => {
    const isChromium = testInfo.project.name === CHROMIUM_PROJECT;
    const context = await browser.newContext();
    const cookies = await signInAndGetCookies(
      supabaseTestClient,
      testUser.email,
      testUser.password,
    );
    await context.addCookies(cookies);
    const page = await context.newPage();

    if (isChromium) {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
      await page.coverage.startCSSCoverage({ resetOnNavigation: false });
    }

    await use(page);

    if (isChromium) {
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();
      const coverageList = [...jsCoverage, ...cssCoverage];
      if (coverageList.length > 0) {
        await addCoverageReport(coverageList, testInfo);
      }
    }

    await context.close();
  },

  page: async ({ page }, use, testInfo) => {
    const isChromium = testInfo.project.name === CHROMIUM_PROJECT;

    if (isChromium) {
      await page.coverage.startJSCoverage({
        resetOnNavigation: false,
      });
      await page.coverage.startCSSCoverage({
        resetOnNavigation: false,
      });
    }

    await use(page);

    if (isChromium) {
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();
      const coverageList = [...jsCoverage, ...cssCoverage];
      if (coverageList.length > 0) {
        await addCoverageReport(coverageList, testInfo);
      }
    }
  },
});

export { expect, test };
