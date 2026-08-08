// ponytail: fixed 09:00:00.000Z suffix — Trello treats due as a timestamp;
// start-of-day UTC 09:00 is the project convention from design #72.
const DUE_TIME_SUFFIX = "T09:00:00.000Z";

export function toTrelloDue(due: string | null): string | undefined {
  return due === null ? undefined : `${due}${DUE_TIME_SUFFIX}`;
}
