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
    qualified: z.boolean().optional(),
    whatsapp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

    // still require this conditional field
    if (data.decisionMaker === "No" && !data.bringDecisionMaker) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bringDecisionMaker"],
        message:
          "If you're not the decision maker, please confirm you can bring them.",
      });
    }
  });

export type FormValues = z.infer<typeof leadSchema>;
