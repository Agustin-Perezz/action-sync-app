import { test as base, expect } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

import { supabaseTestClient } from "./fixtures/supabase-test-client";

const CHROMIUM_PROJECT = "chromium";

const test = base.extend<{
  supabaseTest: typeof supabaseTestClient;
}>({
  supabaseTest: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright requires destructuring pattern
    async ({}, use) => {
      await use(supabaseTestClient);
    },
    { auto: true },
  ],

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

export { test, expect };
