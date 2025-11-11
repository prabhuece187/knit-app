import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/Store";
import {
  calculateRow,
  getAdditionalChargesTotal,
  getInvoiceItemDiscountTotal,
  getInvoiceItemTaxTotal,
  getInvoiceQtyTotal,
  getInvoiceSubtotal,
} from "@/utility/invoice-utils";
import { to2 } from "@/utility/utility";
import type { InvoiceRowRedux } from "@/schema-types/invoice-detail";

// ---------------- BASE ----------------
const selectForm = (state: RootState) => state.invoiceForm;
const selectRows = (state: RootState) =>
  state.invoiceForm.invoice_details ?? [];
const selectCharges = (state: RootState) =>
  state.invoiceForm.additional_charges ?? [];

// ---------------- SUBTOTAL ----------------
export const selectInvoiceSubtotal = createSelector([selectRows], (rows) =>
  getInvoiceSubtotal(rows)
);

// ---------------- BILL DISCOUNT ----------------
export const selectBillDiscount = createSelector(
  [selectForm, selectInvoiceSubtotal],
  (form, subtotal) => {
    let billDiscountAmt = form.bill_discount_amount ?? 0;
    let billDiscountPer = form.bill_discount_per ?? 0;

    if (form.bill_lastEdited === "billDiscountPer") {
      billDiscountAmt = (subtotal * billDiscountPer) / 100;
    } else if (form.bill_lastEdited === "billDiscountAmt") {
      billDiscountPer = subtotal ? (billDiscountAmt / subtotal) * 100 : 0;
    }

    if (!billDiscountAmt || billDiscountAmt <= 0) {
      billDiscountAmt = 0;
      billDiscountPer = 0;
    }

    return {
      billDiscountAmt: to2(billDiscountAmt),
      billDiscountPer: to2(billDiscountPer),
    };
  }
);

// ---------------- CALCULATED ROWS ----------------
export const selectCalculatedRows = createSelector(
  [selectRows, selectInvoiceSubtotal, selectBillDiscount, selectForm],
  (rows, subtotal, billDiscount, form) => {
    const isFromApi = !!form.id && !form.isModified;
    if (isFromApi) return rows.map((r) => ({ ...r }));

    const { billDiscountAmt } = billDiscount;
    const { bill_discount_type } = form;

    if (
      !billDiscountAmt ||
      billDiscountAmt <= 0 ||
      bill_discount_type !== "before_tax"
    ) {
      return rows.map((item) => calculateRow(item as InvoiceRowRedux));
    }

    return rows.map((item) => {
      const gross = (item.quantity ?? 0) * (item.price ?? 0);
      const share = subtotal ? (gross / subtotal) * billDiscountAmt : 0;
      return calculateRow({
        ...item,
        item_discount_amount: to2(share),
        item_discount_per: gross ? to2((share / gross) * 100) : 0,
        discountSource: "bill",
      } as InvoiceRowRedux);
    });
  }
);

// ---------------- ADDITIONAL CHARGES + TAX ----------------
export const selectTaxAndCharges = createSelector(
  [selectCalculatedRows, selectCharges],
  (rows, charges) => {
    const taxTotal = getInvoiceItemTaxTotal(rows);
    const { total: additionalTotal, tax: additionalTax } =
      getAdditionalChargesTotal(charges);
    return { taxTotal, additionalTotal, additionalTax };
  }
);

// ---------------- ROUND OFF TYPE ----------------
export type RoundOffType = "+add" | "-remove" | "none";
function parseRoundOffType(value?: string): RoundOffType {
  if (value === "-remove") return "-remove";
  if (value === "+add") return "+add";
  return "none";
}

// ---------------- INVOICE TOTAL ----------------
export const selectInvoiceTotal = createSelector(
  [
    selectForm,
    selectInvoiceSubtotal,
    selectBillDiscount,
    selectTaxAndCharges,
    selectCalculatedRows,
  ],
  (form, subtotal, discount, taxes, calculatedRows) => {
    const isFromApi = !!form.id && !form.isModified;

    if (isFromApi) {
      const totalFromApi = to2(form.invoice_total ?? 0);
      const roundOffAmount = to2(form.round_off_amount ?? 0);
      const roundOffType = parseRoundOffType(form.round_off_type);
      return { total: totalFromApi, roundOffAmount, roundOffType };
    }

    const totalItemDiscount = getInvoiceItemDiscountTotal(calculatedRows);

    let total =
      subtotal -
      totalItemDiscount +
      (taxes?.taxTotal ?? 0) +
      (taxes?.additionalTotal ?? 0) +
      (taxes?.additionalTax ?? 0);

    if (form.bill_discount_type === "after_tax")
      total -= discount.billDiscountAmt;

    let roundOffAmount = 0;
    let roundOffType: RoundOffType = "none";

    if (form.round_off) {
      const rounded = Math.round(total);
      const diff = to2(rounded - total);
      const autoType: RoundOffType = diff >= 0 ? "+add" : "-remove";
      roundOffAmount = Math.abs(diff) * (autoType === "+add" ? 1 : -1);
      total = to2(total + roundOffAmount);
      roundOffType = autoType;
    } else {
      const manualType = parseRoundOffType(form.round_off_type);
      const manualAmount = to2(form.round_off_amount ?? 0);
      roundOffAmount = manualAmount;
      if (manualType === "+add") total += manualAmount;
      else if (manualType === "-remove") total -= manualAmount;
      roundOffType = manualType;
    }

    return {
      total: to2(total),
      roundOffAmount: to2(roundOffAmount),
      roundOffType,
    };
  }
);

// ---------------- TAX SPLIT ----------------
export const selectInvoiceTaxSplit = createSelector(
  [selectTaxAndCharges],
  (taxes) => {
    const totalTax = (taxes?.taxTotal ?? 0) + (taxes?.additionalTax ?? 0);
    return {
      invoice_sgst: to2(totalTax / 2),
      invoice_cgst: to2(totalTax / 2),
      invoice_igst: 0,
      invoice_taxable_value: to2(totalTax),
    };
  }
);

// ---------------- BALANCE ----------------
export const selectBalanceAmount = createSelector(
  [selectForm, selectInvoiceTotal],
  (form, result) => to2((result?.total ?? 0) - (form.amount_received ?? 0))
);

// ---------------- QUANTITY TOTAL ----------------
export const selectInvoiceQtyTotal = createSelector([selectRows], (rows) =>
  getInvoiceQtyTotal(rows)
);

// ---------------- DUE DATE ----------------
export const selectDueDate = createSelector([selectForm], (form) => {
  if (!form.invoice_date) return "";
  const date = new Date(form.invoice_date);
  const days = Number(form.payment_terms) || 0;
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
});

// ---------------- GUARD SELECTORS ----------------
export const selectIsItemDiscountDisabled = (state: RootState) =>
  (state.invoiceForm.bill_discount_amount ?? 0) > 0;

export const selectIsAnyItemTaxApplied = (state: RootState) =>
  state.invoiceForm.invoice_details.some(
    (item) => (item.item_tax_amount ?? 0) > 0
  );
