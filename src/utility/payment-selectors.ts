// src/selectors/payment-selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/Store";
import {
  getUsedAmount,
  getBalance,
  getPendingTotal,
  type InvoiceItemFrontend,
} from "@/utility/payment-utils";

// Base selectors
const selectForm = (state: RootState) => state.paymentForm;
const selectInvoices = (state: RootState) =>
  (state.paymentForm.invoices as InvoiceItemFrontend[]) ?? [];

/** Used = sum(apply_amount) */
export const selectUsedAmount = createSelector([selectInvoices], (rows) =>
  getUsedAmount(rows)
);

/** Balance = total - used */
export const selectBalanceAmount = createSelector(
  [selectForm, selectInvoices],
  (form, rows) => getBalance(form.total_amount, rows)
);

/** Total pending across all invoices */
export const selectTotalPending = createSelector([selectInvoices], (rows) =>
  getPendingTotal(rows)
);

/** Can submit? (keep simple as requested) */
export const selectCanSubmit = createSelector(
  [selectForm],
  (form) => form.total_amount > 0 && form.customer_id > 0
);

/** Final payload for backend */
export const selectPaymentPayload = createSelector(
  [selectForm, selectInvoices],
  (form, rows) => {
    const settlements = rows
      .filter((r) => r.is_selected && (r.apply_amount ?? 0) > 0)
      .map((r) => ({
        invoice_id: r.id,
        invoice_amount: r.invoice_total,
        paid_before: r.total_paid,
        pay_now: r.apply_amount,
      }));

    return {
      customer_id: form.customer_id,
      payment_date: form.payment_date,
      amount: form.total_amount,
      payment_type: form.payment_type,
      reference_no: form.reference_no,
      note: form.note,
      invoices: settlements,
    };
  }
);
