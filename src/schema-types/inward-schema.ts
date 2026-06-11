import z from "zod";
import type { Item } from "./master-schema";

// =======================  Inward ============================
export const inwardSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),
  customer_id: z.number().min(1, { message: "Customer is required" }),
  mill_id: z.number().min(1, { message: "Mill is required" }),
  inward_no: z.string().min(1, { message: "Inward No is required" }),
  inward_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  supplier_invoice_no: z.coerce.string().optional(),
  vehicle_no: z.coerce.string().optional(),
  total_weight: z.coerce
    .number()
    .min(0.1, { message: "Total weight required" }),
  lot_no: z.coerce.string().optional(),
  no_of_bags: z.coerce.number().min(1, { message: "No of bags required" }),
  remarks: z.string().optional().nullable(),
  received_by: z.coerce.string().min(1, { message: "Received By is required" }),
});

export type Inward = z.infer<typeof inwardSchema>;

// =======================  Inward Detail ============================
export const inwardDetailSchema = z.object({
  id: z.number().optional(),
  inward_id: z.number().optional(),
  user_id: z.number().optional(),
  item_id: z.coerce.number().min(1, { message: "Item required" }),
  yarn_type_id: z.coerce.number().min(1, { message: "Yarn Type required" }),
  yarn_colour: z.string().optional().nullable(),
  bag_no: z.coerce.number().optional().nullable(),
  gross_weight: z.coerce.number().min(0.1, { message: "Gross required" }),
  tare_weight: z.coerce.number().min(0, { message: "Tare required" }),
  net_weight: z.coerce.number().min(0.1, { message: "Net required" }),
  uom: z.string().min(1, { message: "UOM required" }),
  yarn_dia: z.coerce.number().min(0.01, "Dia required"),
  yarn_gsm: z.coerce.number().min(0.01, "GSM required"),
  yarn_gauge: z.string().min(1, "Gauge required"),
  job_card_id: z.number().optional().nullable(),
  job_card_no: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
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

export const inwardQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // ✅ unified search
  searchInput: z.string().optional(),
});

export type InwardQuery = z.infer<typeof inwardQuerySchema>;

export type InwardWithRelations = Inward & {
  customer?: {
    id?: number;
    customer_name?: string;
  };
  mill?: {
    id?: number;
    mill_name?: string;
  };
};

export const inwardSearchColumns: string[] = [
  "inward_no",
  "customer.customer_name",
  "mill.mill_name",
];
