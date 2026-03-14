import z from "zod";

export const appointmentSchema = z.object({
  start_time: z.string().datetime(),
  timezone: z.string().optional(),
});
