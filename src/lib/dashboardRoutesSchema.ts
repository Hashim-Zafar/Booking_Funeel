import { z } from "zod";

export const querySchema = z.object({
  start_date: z.string().datetime({ message: "Invalid start_date format" }),
  end_date: z
    .string()
    .datetime({ message: "Invalid end_date format" })
    .optional(),
});
