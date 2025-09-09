import z from "zod";

// =======================  Invoice ============================
export const invoiceSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.number().optional(),
  customer_id: z.number().min(1, {
    message: "Please Enter Customer Name.",
  }),
  invoice_number: z.string().min(1, {
    message: "Please Enter Invoice Number.",
  }),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  payment_terms: z.string().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  invoice_notes: z.string().optional(),
  invoice_terms: z.string().optional(),

  invoice_subtotal: z.number().optional(),
  invoice_taxable_value: z.number().optional(),
  invoice_total: z.number().optional(),

  invoice_cgst: z.number().optional(),
  invoice_sgst: z.number().optional(),
  invoice_igst: z.number().optional(),

  bill_discount_per: z.number().optional(),
  bill_discount_amount: z.number().optional(),
  bill_discount_type: z.string().optional(),

  amount_received: z.number().optional(),
  amount_received_type: z.string().optional(),

  balance_amount: z.number().optional(),
  round_off: z.number().optional(),

  fully_paid: z.boolean().optional(),

  subtotal_discount: z.number().optional(),
  subtotal_tax: z.number().optional(),

  invoice_type: z.string().optional(),
  invoice_total_quantity: z.number().optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export const invoiceDetailSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.number().optional(),
  invoice_id: z.number().min(1, {
    message: "Please select an Invoice.",
  }),
  item_id: z.number().min(1, {
    message: "Please select an Item.",
  }),
  item_description: z.string().optional(),
  hsn_code: z.string().optional(),
  quantity: z.number().min(1, {
    message: "Please enter Quantity.",
  }),
  price: z.number().min(0, {
    message: "Please enter Price.",
  }),
  item_discount_per: z.number().optional(),
  item_discount_amount: z.number().optional(),
  amount: z.number().optional(),
});

export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;

// =======================  Additional Charges ============================
export const additionalChargeSchema = z.object({
  id: z.coerce.number().optional(),
  invoice_id: z.number().optional(),
  additional_charge_name: z.string().min(1, {
    message: "Please enter Charge Name.",
  }),
  additional_charge_amount: z.number().min(0, {
    message: "Please enter valid Amount.",
  }),
  additional_tax: z.number().optional(),
});

export type AdditionalCharge = z.infer<typeof additionalChargeSchema>;

// =======================  Bank Details ============================
export const bankDetailSchema = z.object({
  account_holder: z.string().min(1, "Enter Account Holder Name."),
  account_number: z.string().min(1, "Enter Account Number."),
  ifsc_code: z.string().min(1, "Enter IFSC Code."),
  bank_name: z.string().min(1, "Enter Bank Name."),
  branch_name: z.string().optional(),
});

export type BankDetail = z.infer<typeof bankDetailSchema>;

// =======================  Full Invoice ============================
export const fullInvoiceSchema = invoiceSchema.extend({
  invoice_details: z
    .array(invoiceDetailSchema)
    .min(1, { message: "Add at least 1 invoice detail" }),
  additional_charges: z.array(additionalChargeSchema).optional(),
  bank_details: bankDetailSchema.optional(),
});

export type FullInvoiceFormValues = z.infer<typeof fullInvoiceSchema>;
