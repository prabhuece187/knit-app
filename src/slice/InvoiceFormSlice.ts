// src/slice/InvoiceFormSlice.ts
"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/Store";
import type {
  AdditionalCharge,
  FullInvoiceFormValues,
  InvoiceDetail,
} from "@/schema-types/invoice-schema";
import type { InvoiceRowRedux } from "@/schema-types/invoice-detail";

// Default today date
const today = new Date().toISOString().split("T")[0];

type UpdatableChargeFields = Partial<
  Pick<
    AdditionalCharge,
    "additional_charge_name" | "additional_charge_amount" | "tax_applicable"
  >
>;

// -------------------- STATE --------------------
export interface InvoiceFormState extends FullInvoiceFormValues {
  selected_tax: string;
  show_discount_form: boolean;
  invoice_details: InvoiceRowRedux[];
  bill_lastEdited?: "billDiscountPer" | "billDiscountAmt";
  isModified?: boolean;
}

const initialState: InvoiceFormState = {
  customer_id: 0,
  bank_id: 0,
  invoice_number: "",
  invoice_date: today,
  due_date: today,
  payment_terms: 0,
  user_id: 1,
  invoice_details: [
    {
      invoice_id: 0,
      user_id: 1,
      item_id: 0,
      item_description: "",
      hsn_code: "",
      quantity: 0,
      price: 0,
      item_discount_per: null,
      item_discount_amount: null,
      item_tax_per: null,
      item_tax_amount: null,
      amount: 0,
      lastEdited: undefined,
      discountSource: undefined,
    },
  ],
  additional_charges: [],
  // bank_details: {
  //   bank_name: "",
  //   account_number: "",
  //   ifsc_code: "",
  //   branch_name: "",
  //   account_holder: "",
  // },
  invoice_notes: "",
  invoice_terms: "",
  invoice_subtotal: 0,
  invoice_total: 0,
  round_off: false,
  amount_received: 0,
  balance_amount: 0,
  invoice_taxable_value: 0,
  invoice_sgst: 0,
  invoice_cgst: 0,
  invoice_igst: 0,
  bill_discount_per: null,
  bill_discount_amount: null,
  bill_discount_type: "before_tax",
  selected_tax: "none",
  show_discount_form: false,
  bill_lastEdited: undefined,
  round_off_type: "none",
  round_off_amount: 0.0,
  isModified: false,
};

// -------------------- SLICE --------------------
const invoiceFormSlice = createSlice({
  name: "invoiceForm",
  initialState,
  reducers: {
    resetForm: () => initialState,

    // Generic field update
    updateField: <K extends keyof InvoiceFormState>(
      state: InvoiceFormState,
      action: PayloadAction<{ field: K; value: InvoiceFormState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
      if (action.payload.field !== "isModified") {
        state.isModified = true; // Mark user touched something
      }
    },

    updateBillDiscount: (
      state,
      action: PayloadAction<{
        billDiscountAmt?: number;
        billDiscountPer?: number;
        lastEdited: "billDiscountPer" | "billDiscountAmt";
      }>
    ) => {
      state.bill_discount_amount = action.payload.billDiscountAmt;
      state.bill_discount_per = action.payload.billDiscountPer;
      state.bill_lastEdited = action.payload.lastEdited;
    },

    // ---------- Invoice Rows ----------
    addItemRow: (state, action: PayloadAction<InvoiceDetail>) => {
      const row: InvoiceRowRedux = {
        ...action.payload,
        discountSource:
          action.payload.discountSource === "bill" ||
          action.payload.discountSource === "item"
            ? action.payload.discountSource
            : undefined,
      };
      state.invoice_details.push(row);
    },

    updateItemRow: (
      state: InvoiceFormState,
      action: PayloadAction<{
        index: number;
        changes: Partial<InvoiceRowRedux>;
      }>
    ) => {
      const { index, changes } = action.payload;
      const item = state.invoice_details[index];
      if (!item) return;

      if ("discountSource" in changes) {
        const val = changes.discountSource;
        item.discountSource =
          val === "bill" || val === "item" ? val : undefined;
        delete changes.discountSource;
      }

      Object.assign(item, changes);
    },

    removeItemRow: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < 0 || index >= state.invoice_details.length) return;
      state.invoice_details.splice(index, 1);
    },

    // ---------- Additional Charges ----------
    addAdditionalCharge: (
      state,
      action: PayloadAction<{
        additional_charge_name: string;
        additional_charge_amount: number;
        tax_applicable?: string;
      }>
    ) => {
      state.additional_charges.push(action.payload);
    },

    updateAdditionalCharge: (
      state,
      action: PayloadAction<{ index: number } & UpdatableChargeFields>
    ) => {
      const { index, ...fieldsToUpdate } = action.payload;
      const charge = state.additional_charges[index];
      if (charge) {
        // Iterate over the payload and update the corresponding fields on the charge object.
        // This is necessary because the payload could contain name, amount, or tax_applicable.
        Object.assign(charge, fieldsToUpdate);
      }
    },

    removeAdditionalCharge: (state, action: PayloadAction<number>) => {
      state.additional_charges.splice(action.payload, 1);
    },

    setFullInvoice: (state, action: PayloadAction<FullInvoiceFormValues>) => {
      const payload = action.payload;

      Object.assign(state, {
        ...payload,
        invoice_details: payload.invoice_details.map((item) => ({
          ...item,
          discountSource:
            item.discountSource === "bill" || item.discountSource === "item"
              ? item.discountSource
              : undefined,
        })),
        additional_charges: payload.additional_charges || [],
        isModified: false,
      });
    },

    toggleDiscountForm: (state) => {
      // Toggle discount form visibility
      state.show_discount_form = !state.show_discount_form;

      // ----- Reset all item-wise discounts -----
      state.invoice_details.forEach((item) => {
        item.item_discount_amount = 0;
        item.item_discount_per = 0;
        item.discountSource = undefined;
        item.lastEdited = undefined;
      });

      // ----- Reset bill discount fields -----
      state.bill_discount_amount = 0;
      state.bill_discount_per = 0;
      state.bill_lastEdited = undefined;
    },
  },
});

// -------------------- ACTIONS --------------------
export const {
  resetForm,
  updateField,
  addItemRow,
  updateItemRow,
  removeItemRow,
  addAdditionalCharge,
  updateAdditionalCharge,
  removeAdditionalCharge,
  toggleDiscountForm,
  updateBillDiscount,
  setFullInvoice,
} = invoiceFormSlice.actions;

// -------------------- SELECTORS --------------------
export const selectInvoiceForm = (state: RootState) => state.invoiceForm;
export const selectInvoiceRows = (state: RootState) =>
  state.invoiceForm.invoice_details;
export const selectAdditionalCharges = (state: RootState) =>
  state.invoiceForm.additional_charges;

// Example: simple flag for disabling item discount
export const selectIsItemDiscountDisabled = (state: RootState) =>
  !!state.invoiceForm.bill_discount_per ||
  !!state.invoiceForm.bill_discount_amount;

// -------------------- DEFAULT EXPORT --------------------
export default invoiceFormSlice.reducer;
