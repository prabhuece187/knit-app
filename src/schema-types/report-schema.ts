import { z } from "zod";

export const OverAllReportSchema = z.object({
    from_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    to_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    user_id: z.number().optional(),
    customer_id: z.number().optional(),
    mill_id: z.number().optional(),
    search_data: z.string().optional(),
})

export type InwardReport = {
  id: number;
  inward_no: string;
  inward_date: string;
  total_quantity: number;
  total_weight: number;
  customer: {
    id: number;
    customer_name: string;
  } | null;
  mill: {
    id: number;
    mill_name: string;
  } | null;
};

export type OutwardReport = {
  id: number;
  outward_no: string;
  outward_date: string;
  total_quantity: number;
  total_weight: number;
  yarn_send: string | null; // add this if your Laravel model has it
  customer: {
    id: number;
    customer_name: string;
  } | null;
  mill: {
    id: number;
    mill_name: string;
  } | null;
};

export type Totals = {
  inward: {
    total_weight: number;
    total_quantity: number;
  };
  outward: {
    total_weight: number;
    total_quantity: number;
  };
  balance: {
    balance_weight: number;
    balance_quantity: number;
  };
};