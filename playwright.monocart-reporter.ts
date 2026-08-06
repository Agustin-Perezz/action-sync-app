import type { ReporterDescription } from "@playwright/test";
import type {
  CoverageReportOptions,
  MonocartReporterOptions,
} from "monocart-reporter";

const coverageOptions: CoverageReportOptions = {
  outputDir: "./coverage/tests",
  reports: [
    ["v8", { outputFile: "v8/index.html" }],
    ["lcov", { outputFile: "lcov.info" }],
    ["cobertura", { outputFile: "cobertura/code-coverage.cobertura.xml" }],
    ["console-summary"],
  ],
  sourceFilter: (sourcePath: string) => {
    if (sourcePath.includes("node_modules")) return false;
    if (sourcePath.includes(".next")) return false;
    return sourcePath.includes("/src/");
  },
};

const monocartOptions: MonocartReporterOptions = {
  name: "Playwright E2E Test Report",
  outputFile: "./coverage/tests/monocart-report.html",
  coverage: coverageOptions,
};

export const monocartReporter: ReporterDescription = [
  "monocart-reporter",
  monocartOptions,
];
