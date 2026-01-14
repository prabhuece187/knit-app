import z from "zod";

export const knittingReworkSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),

  rework_no: z.string().min(1, { message: "Rework No is required" }),

  rework_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format (YYYY-MM-DD)",
  }),

  production_return_id: z
    .number()
    .min(1, { message: "Production Return is required" }),

  job_card_id: z.number().optional(),

  rework_weight: z.coerce
    .number()
    .min(0.1, { message: "Rework weight must be greater than 0" }),

  remarks: z.string().optional(),
});

export type KnittingRework = z.infer<typeof knittingReworkSchema>;
