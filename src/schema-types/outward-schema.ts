import z from "zod";
import type { Item } from "./master-schema";

// =======================  Outward ============================
export const outwardSchema = z.object({
  id: z.number().optional(),

  user_id: z.number().optional(),

  customer_id: z.number().min(1, { message: "Customer required" }),
  mill_id: z.number().min(1, { message: "Mill required" }),
  inward_id: z.number().min(1, { message: "Inward required" }),

  outward_no: z.string().min(1, { message: "Outward No required" }),
  outward_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  outward_invoice_no: z.string().min(1, { message: "Invoice No required" }),
  vehicle_no: z.string().optional(),

  total_weight: z.number().nullable().optional(),

  process_type: z.string().optional(),
  expected_gsm: z.number().nullable().optional(),
  expected_dia: z.number().nullable().optional(),
  job_card_no: z.string().optional(),

  remarks: z.string().optional(),
});

export type Outward = z.infer<typeof outwardSchema>;

// =======================  Outward Detail ============================
export const outwardDetailSchema = z.object({
  id: z.number().optional(),
  outward_id: z.number().optional(),
  user_id: z.number().optional(),

  item_id: z.number().min(1, { message: "Item required" }),
  yarn_type_id: z.number().min(1, { message: "Yarn type required" }),

  shade: z.string().optional(),
  lot_no: z.string().optional(),
  bag_no: z.string().optional(),

  gross_weight: z.number().min(0.1),
  tare_weight: z.number().min(0.1),
  net_weight: z.number().min(0.1),

  uom: z.string().optional(),
  remarks: z.string().optional(),
});

export type OutwardDetail = z.infer<typeof outwardDetailSchema>;

// =======================  Full Outward ============================
export const fullOutwardSchema = outwardSchema.extend({
  outward_details: z
    .array(outwardDetailSchema)
    .min(1, { message: "Add at least 1 outward detail" }),
});

export type FullOutwardFormValues = z.infer<typeof fullOutwardSchema>;

export type ItemWithDetails = Item & {
  outward_qty?: number;
  outward_weight?: number;
  deliverd_weight?: number;
  yarn_dia?: number;
  yarn_gsm?: number;
  yarn_gauge?: string;
  yarn_colour?: string;
};
