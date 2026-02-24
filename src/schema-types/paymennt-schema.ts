import { z } from "zod";
import type { Customer } from "./master-schema";

export const fullPaymentSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),

  customer_id: z.number().min(1, "Customer is required"),

  payment_type: z.enum(["cash", "neft", "cheque"], {
    errorMap: () => ({ message: "Select a valid payment type" }),
  }),

  reference_no: z.string().optional(),

  total_amount: z.number().min(1, "Total amount must be greater than zero"),

  note: z.string().optional(),

  payment_details: z
    .array(
      z.object({
        invoice_id: z.number().min(1, "Missing invoice id"),
        amount: z.number().min(1, "Amount must be greater than zero"),
      }),
    )
    .min(1, "Select at least one invoice"),
});

export type FullPaymentSchema = z.infer<typeof fullPaymentSchema>;

export interface InvoiceItem {
  id: number;
  invoice_number: string;
  invoice_date: string;

  invoice_total: number;
  total_paid: number;
  pending_amount: number;

  customer?: Customer;

  apply_amount?: number;
  is_selected?: boolean;
}

export interface PaymentDetail {
  invoice_id: number;
  amount: number;
}

export interface InvoicePayment {
  id?: number;

  payment_no?: string;
  payment_date: string;

  customer_id: number;
  customer_name?: string;

  payment_type: "cash" | "neft" | "cheque";
  reference_no?: string;

  total_amount: number;

  cheque_date?: string;
  cheque_status?: "cleared" | "pending" | "bounced";

  payment_details: PaymentDetail[];

  invoices?: InvoiceItem[];
}

export interface PaymentFormState {
  customer_id: number;
  payment_date: string;
  payment_type: "cash" | "neft" | "cheque";
  reference_no: string;
  total_amount: number;
  note: string;

  cheque_date?: string;
  cheque_status?: "cleared" | "pending" | "bounced";

  invoices: InvoiceItem[];
}

export type PaymentFormFields = keyof PaymentFormState;

export interface PaymentQuery {
  limit: number;
  curpage: number;
  search?: string;
}

export interface Payment {
  id: number;
  payment_no?: string;
  customer_id: number;
  customer_name?: string;
  payment_date: string;
  payment_type: "cash" | "neft" | "cheque";
  total_amount: number;
  reference_no?: string;
  invoices?: InvoiceItem[];
  payment_details?: {
    invoice_id: number;
    amount: number;
  }[];
}
