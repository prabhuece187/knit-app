"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/Store";
import type {
  InvoiceItem,
  PaymentFormState,
} from "@/schema-types/paymennt-schema";

const today = new Date().toISOString().split("T")[0];

const initialState: PaymentFormState = {
  customer_id: 0,
  payment_date: today,
  payment_type: "cash",
  total_amount: 0,
  reference_no: "",
  note: "",
  invoices: [],
};

const paymentFormSlice = createSlice({
  name: "paymentForm",
  initialState,
  reducers: {
    resetPaymentForm: () => initialState,
    updateField: <K extends keyof PaymentFormState>(
      state: PaymentFormState,
      action: PayloadAction<{ field: K; value: PaymentFormState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setInvoices: (state, action: PayloadAction<InvoiceItem[]>) => {
      state.invoices = action.payload.map((i) => ({
        ...i,
        apply_amount: i.apply_amount ?? 0,
        is_selected: i.is_selected ?? false,
      }));
    },
    toggleInvoice: (state, action: PayloadAction<number>) => {
      const row = state.invoices[action.payload];
      if (!row) return;
      row.is_selected = !row.is_selected;
      if (!row.is_selected) row.apply_amount = 0;
    },
    updateApplyAmount: (
      state,
      action: PayloadAction<{ index: number; value: number }>
    ) => {
      const row = state.invoices[action.payload.index];
      if (!row) return;
      row.apply_amount = action.payload.value;
    },
  },
});

export const {
  resetPaymentForm,
  updateField,
  setInvoices,
  toggleInvoice,
  updateApplyAmount,
} = paymentFormSlice.actions;

export const selectPaymentForm = (state: RootState) => state.paymentForm;

export default paymentFormSlice.reducer;
