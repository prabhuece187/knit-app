  import type { InvoiceRowRedux } from "@/schema-types/invoice-detail";
  import type { AdditionalCharge } from "@/schema-types/invoice-schema";
  import { to2 } from "@/utility/utility";

  // ---------- ROW CALCULATION ----------
  export function calculateRow(item: InvoiceRowRedux): InvoiceRowRedux {
    const gross = (item.quantity ?? 0) * (item.price ?? 0);

    // --- Discount ---
    const discountPer =
      item.lastEdited === "discountAmt"
        ? gross
          ? to2(((item.item_discount_amount ?? 0) / gross) * 100)
          : 0
        : item.item_discount_per ?? 0;

    const discountAmt =
      item.lastEdited === "discountPer"
        ? to2((gross * (item.item_discount_per ?? 0)) / 100)
        : item.item_discount_amount ?? 0;

    // --- Tax (always recalc to stay accurate) ---
    const taxPer = item.item_tax_per ?? 0;
    const taxAmt = to2(((gross - discountAmt) * taxPer) / 100);

    // --- Final amount ---
    const amount = to2(gross - discountAmt + taxAmt);

    return {
      ...item,
      item_discount_per: discountPer,
      item_discount_amount: discountAmt,
      item_tax_per: taxPer,
      item_tax_amount: taxAmt,
      amount,
    };
  }

  // ---------- SUBTOTAL ----------
  export function getInvoiceSubtotal(items: InvoiceRowRedux[]) {
    return to2(
      items.reduce(
        (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
        0
      )
    );
  }

  // ---------- QTY TOTAL ----------
  export function getInvoiceQtyTotal(items: InvoiceRowRedux[]) {
    return to2(
      items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    );
  }

  // ---------- ITEM DISCOUNT TOTAL ----------
  export function getInvoiceItemDiscountTotal(items: InvoiceRowRedux[]) {
    return to2(
      items.reduce((sum, item) => sum + (item.item_discount_amount ?? 0), 0)
    );
  }

  // ---------- ITEM TAX TOTAL ----------
  export function getInvoiceItemTaxTotal(items: InvoiceRowRedux[]) {
    return to2(items.reduce((sum, item) => sum + (item.item_tax_amount ?? 0), 0));
  }

  // ---------- ADDITIONAL CHARGES TOTAL ----------
  export function getAdditionalChargesTotal(charges: AdditionalCharge[]) {
    let total = 0;
    let tax = 0;
    charges.forEach((c) => {
      const amt = c.additional_charge_amount ?? 0;
      total += amt;
      if (c.tax_applicable && c.tax_applicable !== "none") {
        const rate = Number(c.tax_applicable.replace("gst", "")) || 0;
        tax += to2((amt * rate) / 100);
      }
    });
    return { total: to2(total), tax: to2(tax) };
  }
