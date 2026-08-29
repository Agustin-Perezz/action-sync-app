import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
  test: {
    // The Clean Architecture core (use-cases, entity validation, mappers) is
    // framework-agnostic and runs in Node. No jsdom: keeps the suite fast and
    // avoids Server Component / RSC rendering constraints.
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage/unit",
      // Scope = Clean Architecture core only. Include is narrower than exclude:
      // new outer files land outside coverage by default, no drift, no dead globs.
      // sonar.coverage.exclusions in sonar-project.properties aligns the SonarCloud
      // denominator to this same scope — delivery layer and infrastructure are
      // excluded from the coverage gate (covered by E2E, not unit tests).
      include: [
        "src/application/use-cases/**/*.use-case.ts",
        "src/domain/entities/**/*.entity.ts",
        "src/infrastructure/database/postgres/mappers/**/*.mapper.ts",
      ],
    },
  },
});
