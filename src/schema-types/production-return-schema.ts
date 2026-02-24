import { z } from "zod";

/* =======================
   Production Return Schema
========================== */

/* ---------- Base Schema (Used for Create Form) ---------- */

export const productionReturnBaseSchema = z.object({
  user_id: z.number().optional(),

  return_no: z.string().min(1, "Return No is required"),

  job_card_id: z.number().min(1, "Job Card is required"),

  production_id: z.number().optional(),

  return_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  return_weight: z.number().positive("Return weight must be greater than 0"),

  return_reason: z
    .enum(["hole", "oil_stain", "gsm_issue", "dia_issue", "other"])
    .optional(),

  rework_required: z.boolean().optional(),

  remarks: z.string().optional(),
});

/* ---------- Create Type ---------- */

export const createProductionReturnSchema = productionReturnBaseSchema;

export type CreateProductionReturn = z.infer<
  typeof createProductionReturnSchema
>;

/* ---------- Full Schema (Used for Table + Edit) ---------- */

export const productionReturnSchema = productionReturnBaseSchema.extend({
  id: z.number(), // ✅ Required for DB records
});

export type ProductionReturn = z.infer<typeof productionReturnSchema>;

/* ---------- Query Schema (Pagination + Search) ---------- */

export const productionReturnQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export type ProductionReturnQuery = z.infer<typeof productionReturnQuerySchema>;

/* ---------- With Relations Type ---------- */

export type ProductionReturnWithRelations = ProductionReturn & {
  job_master?: {
    id?: number;
    job_card_no?: string;
  };
  production?: {
    id?: number;
    production_no?: string;
  };
};
