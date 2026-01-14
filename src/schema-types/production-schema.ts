// src/schema-types/knitting-production-schema.ts
import z from "zod";

// ======================= Knitting Production =======================
export const knittingProductionSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),

  production_no: z.string().min(1, { message: "Production No required" }),

  production_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  job_card_id: z.number().min(1, { message: "Job Card required" }),

  machine_id: z.number().optional(),

  shift: z.string().optional(),

  operator_name: z.string().optional(),

  remarks: z.string().optional(),
});

export type KnittingProduction = z.infer<typeof knittingProductionSchema>;

// ======================= Knitting Production Detail =======================
export const knittingProductionDetailSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),
  knitting_production_id: z.number().optional(),

  produced_weight: z.number().min(0.1, {
    message: "Produced weight required",
  }),

  rolls_count: z.number().min(1, {
    message: "Rolls count required",
  }),

  dia: z.number().optional(),

  gsm: z.number().optional(),
});

export type KnittingProductionDetail = z.infer<
  typeof knittingProductionDetailSchema
>;

export const fullKnittingProductionSchema = knittingProductionSchema.extend({
  details: z
    .array(knittingProductionDetailSchema)
    .min(1, { message: "Add at least 1 production detail" }),
});

export type FullKnittingProductionFormValues = z.infer<
  typeof fullKnittingProductionSchema
>;
