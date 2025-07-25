import { z } from "zod";

export const OverAllReportSchema = z.object({
  from_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  to_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  user_id: z.number().optional(),
  customer_id: z.number().optional(),
  mill_id: z.number().optional(),
  search_data: z.string().optional(),
});

export type InwardDetail = {
  id: number;
  inward_id: number;
  item_id: number;
  yarn_type_id: number;
  yarn_dia: string;
  yarn_gsm: string;
  yarn_gauge: string;
  inward_qty: number;
  inward_weight: number;
  inward_detail_date: string;
  yarn_colour: string;
  item?: {
    id: number;
    item_name: string;
  };
  yarn_type?: {
    id: number;
    yarn_type: string;
  };
};

export type OutwardDetail = {
  id: number;
  outward_id: number;
  item_id: number;
  yarn_type_id: number;
  yarn_dia: string;
  yarn_gsm: string;
  yarn_gauge: string;
  outward_qty: number;
  outward_weight: number;
  deliverd_weight: number;
  outward_detail_date: string;
  yarn_colour: string;
  item?: {
    id: number;
    item_name: string;
  };
  yarn_type?: {
    id: number;
    yarn_type: string;
  };
};

export type OutwardReport = {
  id: number;
  outward_no: string;
  outward_date: string;
  total_quantity: number;
  total_weight: number;
  yarn_send: string | null; 
  customer: {
    id: number;
    customer_name: string;
  } | null;
  mill: {
    id: number;
    mill_name: string;
  } | null;
  outward_details?: OutwardDetail[]; 
};

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
  inward_details?: InwardDetail[]; 
  outwards?: OutwardReport[]; 
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


export type Tab = {
  name: string;
  icon?: React.ElementType;
  content: React.ReactNode;
};