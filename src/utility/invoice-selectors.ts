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

// ---------------- BASE SELECTORS ----------------
const selectForm = (state: RootState) => state.invoiceForm;
const selectRows = (state: RootState) => state.invoiceForm.invoice_details;
const selectCharges = (state: RootState) =>
  state.invoiceForm.additional_charges;

// ---------------- 1. SUBTOTAL (Base Dependency) ----------------
export const selectInvoiceSubtotal = createSelector([selectRows], (rows) =>
  getInvoiceSubtotal(rows)
);

// ---------------- 2. BILL DISCOUNT (Depends on selectInvoiceSubtotal) ----------------
export const selectBillDiscount = createSelector(
  [selectForm, selectInvoiceSubtotal],
  (form, subtotal) => {
    let billDiscountAmt = form.bill_discount_amount ?? 0;
    let billDiscountPer = form.bill_discount_per ?? 0;

    // Logic to derive the complementary value based on the last user input
    if (form.bill_lastEdited === "billDiscountPer") {
      billDiscountAmt = (subtotal * billDiscountPer) / 100;
    } else if (form.bill_lastEdited === "billDiscountAmt") {
      billDiscountPer = subtotal ? (billDiscountAmt / subtotal) * 100 : 0;
    }

    // If invalid or <= 0 → reset to zero
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

// ---------------- 3. CALCULATED ROWS (Primary Calculation) ----------------
export const selectCalculatedRows = createSelector(
  [selectRows, selectInvoiceSubtotal, selectBillDiscount, selectForm],
  (rows, subtotal, billDiscount, form) => {
    const { billDiscountAmt } = billDiscount;
    const { bill_discount_type } = form;

    if (
      !billDiscountAmt ||
      billDiscountAmt <= 0 ||
      bill_discount_type !== "before_tax"
    ) {
      return rows.map((item) => calculateRow(item as InvoiceRowRedux));
    }

    // --- Proportional Bill Discount Distribution ---
    return rows.map((item) => {
      const gross = (item.quantity ?? 0) * (item.price ?? 0);
      const share = subtotal ? (gross / subtotal) * billDiscountAmt : 0;

      const discountedItem = {
        ...item,
        item_discount_amount: to2(share),
        item_discount_per: gross ? to2((share / gross) * 100) : 0,
        discountSource: "bill" as const,
      };

      return calculateRow(discountedItem as InvoiceRowRedux);
    });
  }
);

// ---------------- 4. ADDITIONAL CHARGES + TAX ----------------
export const selectTaxAndCharges = createSelector(
  [selectCalculatedRows, selectCharges],
  (rows, charges) => {
    const taxTotal = getInvoiceItemTaxTotal(rows);
    const { total: additionalTotal, tax: additionalTax } =
      getAdditionalChargesTotal(charges);
    return { taxTotal, additionalTotal, additionalTax };
  }
);

// ----------------5. TAXABLE VALUE ----------------
export const selectTaxableValue = createSelector(
  [selectInvoiceSubtotal, selectCalculatedRows],
  (subtotal, rows) => subtotal - getInvoiceItemDiscountTotal(rows)
);

// ----------------6. FINAL TOTAL (Corrected) ----------------
export const selectInvoiceTotal = createSelector(
  [
    selectForm,
    selectInvoiceSubtotal,
    selectBillDiscount,
    selectTaxAndCharges,
    selectCalculatedRows,
  ],
  (form, subtotal, discount, taxes, calculatedRows) => {
    // Get the total item discount *after* bill discount distribution
    const totalItemDiscount = getInvoiceItemDiscountTotal(calculatedRows);

    // Taxable value is gross subtotal minus all applied discounts
    const taxableValue = subtotal - totalItemDiscount;

    let total =
      taxableValue +
      taxes.taxTotal +
      taxes.additionalTotal +
      taxes.additionalTax -
      (form.bill_discount_type === "after_tax" ? discount.billDiscountAmt : 0); // Apply after_tax discount here

    let roundOffAmount = 0;

    // Round-off handling
    if (form.round_off === true) {
      // Auto round-off mode
      const rounded = Math.round(total);
      roundOffAmount = to2(rounded - total); // Ex: 1752 - 1752.33 = -0.33
      total = rounded;
    } else {
      // Manual round-off mode
      const manual = to2(form.round_off_amount ?? 0);
      if (form.round_off_type === "+add") total += manual;
      else if (form.round_off_type === "-remove") total -= manual;
      roundOffAmount = manual;
    }

    // return to2(total);
    return {
      total: to2(total),
      roundOffAmount: to2(roundOffAmount),
    };
  }
);

// ----------------7. TAX SPLIT (SGST/CGST/IGST) ----------------
export const selectInvoiceTaxSplit = createSelector(
  [selectTaxAndCharges],
  (taxes) => {
    return {
      invoice_sgst: to2((taxes.taxTotal + taxes.additionalTax) / 2),
      invoice_cgst: to2((taxes.taxTotal + taxes.additionalTax) / 2),
      invoice_igst: 0, // Assuming IGST is zero for SGST/CGST split
      invoice_taxable_value: to2(taxes.taxTotal + taxes.additionalTax),
    };
  }
);

// ----------------8. BALANCE ----------------
export const selectBalanceAmount = createSelector(
  [selectForm, selectInvoiceTotal],
  (form, result) => {
    const total = result.total ?? 0;
    return to2(total - (form.amount_received ?? 0));
  }
);

// ----------------9. DUE DATE (derived) ----------------
export const selectDueDate = createSelector([selectForm], (form) => {
  if (!form.invoice_date) return "";
  const date = new Date(form.invoice_date);
  const days = Number(form.payment_terms) || 0;
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
});

// ---------------- 10. GUARD SELECTORS ----------------
// These still correctly use the raw bill_discount_amount from state
export const selectIsItemDiscountDisabled = (state: RootState) =>
  (state.invoiceForm.bill_discount_amount ?? 0) > 0;

export const selectIsAnyItemTaxApplied = (state: RootState) =>
  state.invoiceForm.invoice_details.some(
    (item) => (item.item_tax_amount ?? 0) > 0
  );

// ---------------- 11. Quantity Total  ----------------
export const selectInvoiceQtyTotal = createSelector([selectRows], (rows) =>
  getInvoiceQtyTotal(rows)
);
