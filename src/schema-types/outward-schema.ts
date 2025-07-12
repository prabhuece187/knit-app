import z from "zod";
import type { Item } from "./master-schema";

// =======================  Outward ============================
export const outwardSchema = z.object({
  id: z.coerce.number().optional(),
  customer_id: z.number().min(1, {
    message: "Please Enter Customer Name.",
  }),
  user_id: z.number().optional(),
  mill_id: z.number().min(1, {
    message: "Please Enter Mill Name.",
  }),
  outward_no: z.string().min(1, {
    message: "Please Enter the Outward No.",
  }),
  inward_id: z.coerce.number().min(1, {
    message: "Please Enter the Inward Reference.",
  }),
  outward_invoice_no: z.coerce
    .string()
    .min(1, { message: "Please Enter the Invoice No." }),
  outward_tin_no: z.coerce
    .string()
    .min(1, { message: "Please Enter the Tin No." }),
  outward_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  total_weight: z.number().optional(),
  total_quantity: z.number().optional(),
  outward_vehicle_no: z.string().optional(),
  status: z.string().optional(),
  yarn_send: z.string().optional(),
});

export type Outward = z.infer<typeof outwardSchema>;

// =======================  Outward Detail ============================
export const outwardDetailSchema = z.object({
  id: z.number().optional(),
  outward_id: z.number().optional(),
  item_id: z.number().min(1, {
    message: "Please Enter the Item.",
  }),
  user_id: z.number().optional(),
  yarn_type_id: z.number().optional(),
  yarn_gauge: z.string(),
  outward_detail_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  outward_qty: z.number(),
  outward_weight: z.number(),
  deliverd_weight: z.number().optional(),
  yarn_dia: z.number(),
  yarn_gsm: z.number(),
  yarn_colour: z.string().optional(),
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
