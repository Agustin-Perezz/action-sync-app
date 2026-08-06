import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit client source maps for the production build so Playwright/Monocart
  // V8 coverage can resolve browser JS back to `src/`. Without this the LCOV
  // records `SF:` paths against bundled chunks and SonarCloud cannot map
  // coverage to source. (Server-side coverage comes from the Vitest unit layer.)
  productionBrowserSourceMaps: true,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  sourcemaps: { disable: false },
});
