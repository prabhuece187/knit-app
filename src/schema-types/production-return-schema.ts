import z from "zod";

export const productionReturnSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),

  return_no: z.string().min(1, { message: "Return No is required" }),
  job_card_id: z.number().min(1, { message: "Job Card is required" }),
  production_id: z.number().optional(),

  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format (YYYY-MM-DD)",
  }),

  return_weight: z
    .number()
    .min(0.1, { message: "Return weight must be greater than 0" }),
  return_reason: z
    .enum(["hole", "oil_stain", "gsm_issue", "dia_issue", "other"])
    .optional(),
  rework_required: z.boolean().optional(),
  remarks: z.string().optional(),
});

export type ProductionReturn = z.infer<typeof productionReturnSchema>;
