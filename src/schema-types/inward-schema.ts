import z from "zod";
import type { Item } from "./master-schema";

// =======================  Inward ============================
export const inwardSchema = z.object({
  id: z.coerce.number().optional(),
  customer_id: z.number().min(1, {
    message: "Please Enter Customer Name.",
  }),
  user_id: z.number().optional(),
  mill_id: z.number().min(1, {
    message: "Please Enter Mill Name.",
  }),
  inward_no: z.string().min(1, {
    message: "Please Enter the Inward No.",
  }),
  inward_invoice_no: z.coerce
    .string()
    .min(1, { message: "Please Enter the Invoice No." }),
  inward_tin_no: z.coerce
    .string()
    .min(1, { message: "Please Enter the Tin No.." }),
  inward_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  total_weight: z.number().optional(),
  total_quantity: z.number().optional(),
  inward_vehicle_no: z.string().optional(),
  status: z.string().optional(),
});

export type Inward = z.infer<typeof inwardSchema>;

// =======================  Inward Detail ============================
export const inwardDetailSchema = z.object({
  id: z.number().optional(),
  inward_id: z.number().optional(),
  item_id: z.number().min(1, {
    message: "Please Enter the Item .",
  }),
  user_id: z.number().optional(),
  yarn_type_id: z.number().optional(),
  yarn_gauge: z.string(),
  inward_detail_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  inward_qty: z.number(),
  inward_weight: z.number(),
  yarn_dia: z.number(),
  yarn_gsm: z.number(),
  yarn_colour: z.string().optional(),
});

export type InwardDetail = z.infer<typeof inwardDetailSchema>;

export const fullInwardSchema = inwardSchema.extend({
  inward_details: z
    .array(inwardDetailSchema)
    .min(1, { message: "Add at least 1 inward detail" }),
});

export type FullInwardFormValues = z.infer<typeof fullInwardSchema>;

export type ItemWithDetails = Item & {
  inward_qty?: number;
  inward_weight?: number;
  yarn_dia?: number;
  yarn_gsm?: number;
  yarn_gauge?: string;
  yarn_colour?: string;
};
