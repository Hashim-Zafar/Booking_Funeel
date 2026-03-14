import { z } from "zod";

import {
  ALLOWED_NEEDS,
  REQUIRE_PROOF_OF_DEMAND,
  decisionMakerOptions,
  bringDecisionMakerOptions,
  adSpendOptions,
  creativeBudgetOptions,
  needOptions,
  startOptions,
  demandOptions,
  assetsOptions,
  
} from "@/src/utils";

import {
  isAdSpendQualified,
  isCreativeBudgetQualified,
  isValidWhatsApp,
} from "@/src/utils/helpers";

export const leadSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),

    decisionMaker: z.enum(decisionMakerOptions).optional(),
    bringDecisionMaker: z.enum(bringDecisionMakerOptions).optional(),

    adSpend: z.enum(adSpendOptions).optional(),
    creativeBudget: z.enum(creativeBudgetOptions).optional(),

    need: z.enum(needOptions).optional(),
    startWhen: z.enum(startOptions).optional(),
    demand: z.enum(demandOptions).optional(),
    assets: z.enum(assetsOptions).optional(),

    whatsapp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Require all single-select questions to be answered
    const requiredFields: Array<keyof typeof data> = [
      "decisionMaker",
      "adSpend",
      "creativeBudget",
      "need",
      "startWhen",
      "demand",
      "assets",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "This field is required",
        });
      }
    }

    // Q1 rule: must be Yes OR (No but brings decision maker)
    if (data.decisionMaker === "No") {
      if (!data.bringDecisionMaker) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bringDecisionMaker"],
          message:
            "If you’re not the decision maker, please confirm you can bring them.",
        });
      } else if (data.bringDecisionMaker !== "Yes, I’ll bring them") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["decisionMaker"],
          message: "We can only proceed if the decision maker joins the call.",
        });
      }
    }

    // Q2 rule: must be 500+
    if (data.adSpend && !isAdSpendQualified(data.adSpend)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adSpend"],
        message:
          "We’re currently a fit for brands spending $500+/month on ads.",
      });
    }

    // Q3 rule: must be 800+
    if (
      data.creativeBudget &&
      !isCreativeBudgetQualified(data.creativeBudget)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creativeBudget"],
        message:
          "We’re currently a fit for budgets of $800+/month for creative production.",
      });
    }

    // Q4 rule: must be a service you sell
    if (data.need && !ALLOWED_NEEDS.includes(data.need as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["need"],
        message: "We’re not the best fit for that request right now.",
      });
    }

    // Q5 rule: must NOT be just researching
    if (data.startWhen === "Just researching") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startWhen"],
        message: "Please reach out when you’re closer to starting.",
      });
    }

    // Q6 rule: usually require Yes
    if (REQUIRE_PROOF_OF_DEMAND && data.demand === "Not yet") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["demand"],
        message:
          "We prioritize brands with an offer already converting (sales/leads).",
      });
    }


  });

export type FormValues = z.infer<typeof leadSchema>;
