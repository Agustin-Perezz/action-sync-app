import { describe, expect, it } from "vitest";
import { toTrelloDue } from "./due";

describe("toTrelloDue", () => {
  it("returns undefined for null so the param can be omitted", () => {
    expect(toTrelloDue(null)).toBeUndefined();
  });

  it("converts a YYYY-MM-DD date to start-of-day UTC 09:00", () => {
    expect(toTrelloDue("2026-08-15")).toBe("2026-08-15T09:00:00.000Z");
  });

  it("preserves the input date component verbatim across months", () => {
    expect(toTrelloDue("2026-12-31")).toBe("2026-12-31T09:00:00.000Z");
  });

  it("handles a year boundary date without rollover", () => {
    expect(toTrelloDue("2027-01-01")).toBe("2027-01-01T09:00:00.000Z");
  });
});
