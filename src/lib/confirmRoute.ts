import z from "zod";

export const confirmRequestBody = z.object({
  token: z.string(),
});
