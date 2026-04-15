export const decisionMakerOptions = ["Yes", "No"] as const;
export const bringDecisionMakerOptions = [
  "Yes, I’ll bring them",
  "No",
] as const;

export const adSpendOptions = [
  "0",
  "1–500",
  "500–2,000",
  "2,000–10,000",
  "10,000+",
] as const;

export const creativeBudgetOptions = [
  "<300",
  "300–800",
  "800–2,000",
  "2,000–5,000",
  "5,000+",
] as const;

export const needOptions = [
  "Ad creatives for Meta/TikTok/YouTube",
  "UGC",
  "Brand video",
  "Not sure",
] as const;

export const startOptions = [
  "ASAP (7 days)",
  "1–2 weeks",
  "This month",
  "Just researching",
] as const;

export const demandOptions = [
  "Yes (we’re already getting sales/leads)",
  "Not yet",
] as const;

export const assetsOptions = [
  "Yes (brand assets + footage)",
  "Some",
  "No",
] as const;

export const ALLOWED_NEEDS = [
  "Ad creatives for Meta/TikTok/YouTube",
  "UGC",
  "Not sure",
] as const;

export const REQUIRE_PROOF_OF_DEMAND = true;

export type QuestionField =
  | "decisionMaker"
  | "bringDecisionMaker"
  | "adSpend"
  | "creativeBudget"
  | "need"
  | "startWhen"
  | "demand"
  | "assets"
  | "reminderChannel";

export type QuestionConfig = {
  key: string;
  field: QuestionField;
  label: string;
  options: readonly string[];
  /** if provided, question only shows when this returns true */
  showWhen?: (values: Record<string, any>) => boolean;
};

export const QUESTIONS: QuestionConfig[] = [
  {
    key: "q1",
    field: "decisionMaker",
    label: "Are you the decision maker for hiring a video agency?",
    options: decisionMakerOptions,
  },
  {
    key: "q1b",
    field: "bringDecisionMaker",
    label: "If not, can you bring the decision maker to the call?",
    options: bringDecisionMakerOptions,
    showWhen: (v) => v.decisionMaker === "No",
  },
  {
    key: "q2",
    field: "adSpend",
    label: "What’s your monthly ad spend? (last 30 days)",
    options: adSpendOptions,
  },
  {
    key: "q3",
    field: "creativeBudget",
    label: "What’s your monthly budget for video editing/creative production?",
    options: creativeBudgetOptions,
  },
  {
    key: "q4",
    field: "need",
    label: "What are you looking for right now?",
    options: needOptions,
  },
  {
    key: "q5",
    field: "startWhen",
    label: "How soon do you want to start?",
    options: startOptions,
  },
  {
    key: "q6",
    field: "demand",
    label: "Do you have an offer that’s already selling? (proof of demand)",
    options: demandOptions,
  },
  {
    key: "q7",
    field: "assets",
    label: "Do you have the assets to produce ads this week?",
    options: assetsOptions,
  },
];

export const buckets = [
  { key: "b5000Plus", label: "$5,000+", tier: 1 },
  { key: "b2000_5000", label: "$2,000 – $5,000", tier: 2 },
  { key: "b800_2000", label: "$800 – $2,000", tier: 3 },
  { key: "b300_800", label: "$300 – $800", tier: 4 },
  { key: "lt300", label: "Under $300", tier: 5 },
] as const;

export const tierTextColor: Record<number, string> = {
  1: "var(--dash-success)",
  2: "#3b82f6",
  3: "#f59e0b",
  4: "#f59e0b",
  5: "#ef4444",
};

export const tierLabel: Record<number, string> = {
  1: "TIER 1 RATIO",
  2: "TIER 2 RATIO",
  3: "TIER 3 RATIO",
  4: "TIER 4 RATIO",
  5: "TIER 5 RATIO",
};

export const calloutBg: Record<number, string> = {
  1: "#d1fae5",
  2: "#dbeafe",
  3: "#fef3c7",
  4: "#fef3c7",
  5: "#fee2e2",
};

export const intentBuckets = [
  { key: "adCreatives", label: "Ad Creatives" },
  { key: "ugc", label: "UGC Content" },
  { key: "brandVideo", label: "Brand Video" },
  { key: "notSure", label: "Not Sure" },
] as const;

export const timelineBuckets = [
  { key: "asap", label: "IMMEDIATE" },
  { key: "oneToTwoWeeks", label: "1–3 MONTHS" },
  { key: "thisMonth", label: "3+ MONTHS" },
] as const;
