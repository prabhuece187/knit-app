import z from "zod";
import type { Item } from "./master-schema";

// Helper transforms for booleans that might be 0/1
const coerceBoolean = z
  .union([z.boolean(), z.number(), z.string()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    if (typeof v === "string") return v === "true" || v === "1";
    return false;
  });

// =======================  Invoice ============================
export const baseInvoiceSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  customer_id: z.coerce
    .number()
    .min(1, { message: "Please Enter Customer Name." }),
  bank_id: z.coerce.number().min(1, { message: "Please Enter Bank Name." }),

  invoice_number: z
    .string()
    .min(1, { message: "Please Enter Invoice Number." }),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  payment_terms: z.coerce.number().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),

  invoice_notes: z.string().optional(),
  invoice_terms: z.string().optional(),

  invoice_subtotal: z.coerce.number().optional(),
  invoice_taxable_value: z.coerce.number().optional(),
  invoice_total: z.coerce.number().optional(),

  invoice_cgst: z.coerce.number().nullable().optional(),
  invoice_sgst: z.coerce.number().nullable().optional(),
  invoice_igst: z.coerce.number().nullable().optional(),

  bill_discount_per: z.coerce.number().nullable().optional(),
  bill_discount_amount: z.coerce.number().nullable().optional(),
  bill_discount_type: z.string().optional(),

  amount_received: z.coerce.number().optional(),
  amount_received_type: z.string().nullable().optional(),

  balance_amount: z.coerce.number().optional(),
  round_off: coerceBoolean.optional(),
  round_off_type: z.string().optional(),
  round_off_amount: z.coerce.number().optional(),

  fully_paid: coerceBoolean.optional(),

  subtotal_discount: z.coerce.number().optional(),
  subtotal_tax: z.coerce.number().optional(),

  invoice_type: z.string().nullable().optional(),
  invoice_total_quantity: z.coerce.number().optional(),
});

export const invoiceSchema = baseInvoiceSchema
  .refine(
    (data) =>
      !data.due_date || new Date(data.due_date) >= new Date(data.invoice_date),
    { message: "Due date cannot be before invoice date.", path: ["due_date"] }
  )
  .refine(
    (data) =>
      !data.round_off ||
      (data.round_off && data.round_off_amount !== undefined),
    { message: "Round off amount required.", path: ["round_off_amount"] }
  )
  .refine(
    (data) =>
      !data.fully_paid || (data.fully_paid && data.balance_amount === 0),
    { message: "Balance must be 0 when fully paid.", path: ["balance_amount"] }
  )
  .refine(
    (data) => {
      if (data.bill_discount_per && data.bill_discount_per < 0) return false;
      if (data.bill_discount_amount && data.bill_discount_amount < 0)
        return false;
      return true;
    },
    {
      message: "Discount values cannot be negative.",
      path: ["bill_discount_per"],
    }
  );

export type Invoice = z.infer<typeof invoiceSchema>;

// =======================  Invoice Detail ============================
export const invoiceDetailSchema = z
  .object({
    id: z.coerce.number().optional(),
    user_id: z.coerce.number().optional(),
    invoice_id: z.coerce.number().optional(),
    item_id: z.coerce.number().min(1, { message: "Please select an Item." }),
    item_description: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),
    hsn_code: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),
    quantity: z.coerce.number().min(1, { message: "Please enter Quantity." }),
    price: z.coerce.number().min(1, { message: "Please enter Price." }),
    item_discount_per: z.coerce.number().nullable().optional(),
    item_discount_amount: z.coerce.number().nullable().optional(),
    item_tax_per: z.coerce.number().nullable().optional(),
    item_tax_amount: z.coerce.number().nullable().optional(),
    amount: z.coerce.number().optional(),
    discountSource: z.string().nullable().optional(),
  })
  .refine(
    (data) => (data.quantity ?? 0) * (data.price ?? 0) >= 0,
    "Invalid item total."
  );

export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;

// =======================  Additional Charges ============================
export const additionalChargeSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  invoice_id: z.coerce.number().optional(),
  additional_charge_name: z
    .string()
    .min(1, { message: "Please enter Charge Name." }),
  additional_charge_amount: z.coerce
    .number()
    .min(1, { message: "Please enter valid Amount." }),
  tax_applicable: z.string().nullable().optional(),
});

export type AdditionalCharge = z.infer<typeof additionalChargeSchema>;

// =======================  Invoice Taxes ============================

export const invoiceTaxSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  invoice_id: z.coerce.number().optional(),
  tax_type: z.string().min(1, { message: "Missing tax type" }),
  tax_rate: z.coerce.number().min(0, { message: "Invalid rate" }),
  tax_amount: z.coerce.number().min(0, { message: "Invalid amount" }),
});

export type InvoiceTax = z.infer<typeof invoiceTaxSchema>;

// =======================  Full Invoice ============================
export const fullInvoiceSchema = baseInvoiceSchema.extend({
  invoice_details: z
    .array(invoiceDetailSchema)
    .min(1, "Add at least one item."),
  additional_charges: z.array(additionalChargeSchema),
  invoice_taxes: z.array(invoiceTaxSchema),
  customer: z
    .object({
      id: z.coerce.number().optional(),
      customer_name: z.string().optional(),
      state_code: z.string().optional(),
    })
    .optional(),
});

export type FullInvoiceFormValues = z.infer<typeof fullInvoiceSchema>;
export type InvoiceFormState = FullInvoiceFormValues;
export type InvoiceFormFields = keyof InvoiceFormState;

// =======================  Types ============================
export type InvoiceItemWithDetails = Item & {
  id?: number;
  item_id: number;
  item_description: string;
  hsn_code?: string;
  quantity: number;
  price: number;
  item_discount_per: number | null | undefined;
  item_discount_amount: number | null | undefined;
  tax_per: number | null | undefined;
  tax_amount: number | null | undefined;
  amount: number;
};

export const invoiceRowSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  invoice_id: z.coerce.number(),
  item_id: z.coerce.number(),
  description: z.string().optional(),
  hsn_code: z.string().optional(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  item_discount_per: z.coerce.number().nullable().optional(),
  item_discount_amount: z.coerce.number().nullable().optional(),
  item_tax_per: z.coerce.number().nullable().optional(),
  item_tax_amount: z.coerce.number().nullable().optional(),
  amount: z.coerce.number().optional(),
});

export type InvoiceRow = z.infer<typeof invoiceRowSchema>;

export type InvoiceRedux = Invoice & {
  bill_lastEdited?: "billDiscountPer" | "billDiscountAmt";
};
