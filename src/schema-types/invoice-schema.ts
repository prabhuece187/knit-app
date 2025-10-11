import z from "zod";
import type { Item } from "./master-schema";

// =======================  Invoice ============================
export const baseInvoiceSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.number().optional(),
  customer_id: z.number().min(1, {
    message: "Please Enter Customer Name.",
  }),
  bank_id: z.number().min(1, {
    message: "Please Enter Bank Name.",
  }),
  invoice_number: z.string().min(1, {
    message: "Please Enter Invoice Number.",
  }),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  payment_terms: z.number().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  invoice_notes: z.string().optional(),
  invoice_terms: z.string().optional(),

  invoice_subtotal: z.number().optional(),
  invoice_taxable_value: z.number().optional(),
  invoice_total: z.number().optional(),

  invoice_cgst: z.number().nullable().optional(),
  invoice_sgst: z.number().nullable().optional(),
  invoice_igst: z.number().nullable().optional(),

  bill_discount_per: z.number().nullable().optional(),
  bill_discount_amount: z.number().nullable().optional(),
  bill_discount_type: z.string().optional(),

  amount_received: z.number().optional(),
  amount_received_type: z.string().optional(),

  balance_amount: z.number().optional(),
  round_off: z.boolean().optional(),
  round_off_type: z.string().optional(),
  round_off_amount: z.number().optional(),

  fully_paid: z.boolean().optional(),

  subtotal_discount: z.number().optional(),
  subtotal_tax: z.number().optional(),

  invoice_type: z.string().optional(),
  invoice_total_quantity: z.number().optional(),
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

export const invoiceDetailSchema = z
  .object({
    id: z.coerce.number().optional(),
    user_id: z.number().optional(),
    invoice_id: z.number().optional(),
    item_id: z.number().min(1, {
      message: "Please select an Item.",
    }),
    item_description: z.string().optional(),
    hsn_code: z.string().optional(),
    quantity: z.number().min(1, {
      message: "Please enter Quantity.",
    }),
    price: z.number().min(1, {
      message: "Please enter Price.",
    }),
    item_discount_per: z.number().nullable().optional(),
    item_discount_amount: z.number().nullable().optional(),
    item_tax_per: z.number().nullable().optional(),
    item_tax_amount: z.number().nullable().optional(),
    amount: z.number().optional(),
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
  user_id: z.number().optional(),
  invoice_id: z.number().optional(),
  additional_charge_name: z.string().min(1, {
    message: "Please enter Charge Name.",
  }),
  additional_charge_amount: z.number().min(1, {
    message: "Please enter valid Amount.",
  }),
  tax_applicable: z.string().nullable().optional(),
});

export type AdditionalCharge = z.infer<typeof additionalChargeSchema>;

// =======================  Full Invoice ============================
export const fullInvoiceSchema = baseInvoiceSchema.extend({
  invoice_details: z
    .array(invoiceDetailSchema)
    .min(1, "Add at least one item."),
  additional_charges: z.array(additionalChargeSchema),
  // bank_details: bankDetailSchema,
});

export type FullInvoiceFormValues = z.infer<typeof fullInvoiceSchema>;

export type InvoiceFormState = FullInvoiceFormValues;

export type InvoiceFormFields = keyof InvoiceFormState;

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
  id: z.number().optional(),
  user_id: z.number().optional(),
  invoice_id: z.number(),
  item_id: z.number(),
  description: z.string().optional(),
  hsn_code: z.string().optional(),
  quantity: z.number(),
  price: z.number(),
  item_discount_per: z.number().nullable().optional(),
  item_discount_amount: z.number().nullable().optional(),
  item_tax_per: z.number().nullable().optional(),
  item_tax_amount: z.number().nullable().optional(),
  amount: z.number().optional(),
});

export type InvoiceRow = z.infer<typeof invoiceRowSchema>;

export type InvoiceRedux = Invoice & {
  bill_lastEdited?: "billDiscountPer" | "billDiscountAmt";
};
