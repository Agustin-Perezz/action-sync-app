export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
};

export const INITIAL_TASKS: readonly Task[] = [
  {
    id: "task-1",
    title: "Send Q2 roadmap draft to stakeholders",
    description:
      "Compile the engineering roadmap draft and circulate it to the product and design leads by EOD Friday for review before the all-hands.",
    dueDate: "2026-08-08",
  },
  {
    id: "task-2",
    title: "Schedule design review for onboarding flow",
    description:
      "Book a 45-minute review with the design team to walk through the new onboarding screens and gather feedback on the first-run experience.",
    dueDate: "2026-08-10",
  },
  {
    id: "task-3",
    title: "Follow up with Acme on contract renewal",
    description:
      "Reach out to the Acme procurement contact regarding the renewal terms. Confirm pricing lock-in and send over the updated MSA redlines.",
    dueDate: "2026-08-07",
  },
  {
    id: "task-4",
    title: "Prepare demo environment for sales call",
    description:
      "Provision a fresh demo workspace seeded with sample data for Tuesday's enterprise demo. Verify SSO login works end-to-end.",
    dueDate: "2026-08-12",
  },
  {
    id: "task-5",
    title: "Write post-mortem for last week's incident",
    description:
      "Document the root cause, timeline, and action items from the API outage. Share the draft in the #engineering channel for comments.",
    dueDate: "",
  },
] as const;

export const MOCK_BOARDS: readonly string[] = [
  "Product Roadmap",
  "Marketing Sprint",
  "Engineering Board",
] as const;

export const MOCK_LISTS: readonly string[] = [
  "To Do",
  "In Progress",
  "Done",
] as const;
