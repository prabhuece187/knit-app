// src/utility/payment-utils.ts
/**
 * PURE payment utilities for PaymentForm.
 * No Redux. No side effects.
 */

import { to2 } from "./utility";

/** Frontend invoice shape */
export interface InvoiceItemFrontend {
  id: number;
  invoice_number?: string;
  invoice_date?: string;

  // Backend fields (may come as string)
  invoice_total: number | string;
  total_paid?: number | string;

  // Computed
  pending_amount?: number;
  apply_amount?: number;
  is_selected?: boolean;
}

/** Safe number cast */
export function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** pending = total - paid */
export function computePending(i: InvoiceItemFrontend): number {
  return to2(Math.max(0, toNumber(i.invoice_total) - toNumber(i.total_paid)));
}

/** Normalize backend → frontend */
export function normalizeInvoices(
  rows: InvoiceItemFrontend[] = []
): InvoiceItemFrontend[] {
  return rows.map((i) => {
    const invoice_total = toNumber(i.invoice_total);
    const total_paid = toNumber(i.total_paid);
    const pending_amount = to2(invoice_total - total_paid);

    return {
      ...i,
      invoice_total,
      total_paid,
      pending_amount,
      apply_amount: to2(i.apply_amount ?? 0),
      is_selected: !!i.is_selected,
    };
  });
}

/** -------------------- */
/** SUMMING UTILITIES   */
/** -------------------- */
export function getUsedAmount(rows: InvoiceItemFrontend[]): number {
  return to2(
    rows.reduce((sum, inv) => sum + toNumber(inv.apply_amount ?? 0), 0)
  );
}

export function getPendingTotal(rows: InvoiceItemFrontend[]): number {
  return to2(
    rows.reduce((sum, inv) => sum + toNumber(inv.pending_amount ?? 0), 0)
  );
}

export function getBalance(total: number, rows: InvoiceItemFrontend[]): number {
  return to2(total - getUsedAmount(rows));
}

/** -------------------- */
/** VALIDATION UTILITIES */
/** -------------------- */
export function validateApply(
  value: number,
  pending: number
): { ok: boolean; corrected: number } {
  const v = to2(value);
  const p = to2(pending);

  if (v < 0) return { ok: false, corrected: 0 };
  if (v > p) return { ok: false, corrected: p };
  return { ok: true, corrected: v };
}

/** -------------------- */
/** TOGGLE INVOICE       */
/** -------------------- */
export function toggleInvoiceByIndex(
  rows: InvoiceItemFrontend[],
  idx: number
): InvoiceItemFrontend[] {
  return rows.map((inv, i) => {
    if (i !== idx) return inv;
    const nowSelected = !inv.is_selected;
    return {
      ...inv,
      is_selected: nowSelected,
      apply_amount: nowSelected ? inv.pending_amount ?? 0 : 0,
    };
  });
}

/** -------------------- */
/** UPDATE APPLY AMOUNT  */
/** -------------------- */
export function updateApplyAmountByIndex(
  rows: InvoiceItemFrontend[],
  idx: number,
  value: number
): InvoiceItemFrontend[] {
  return rows.map((inv, i) => {
    if (i !== idx) return inv;
    const pending = inv.pending_amount ?? 0;
    const { corrected } = validateApply(value, pending);
    return {
      ...inv,
      apply_amount: corrected,
      is_selected: corrected > 0,
    };
  });
}

/** -------------------- */
/** AUTO DISTRIBUTE      */
/** -------------------- */
export function autoDistributeAmount(
  rows: InvoiceItemFrontend[],
  totalAmount: number
): InvoiceItemFrontend[] {
  let remaining = to2(totalAmount);

  return rows.map((inv) => {
    if (!inv.is_selected) return { ...inv, apply_amount: 0 };
    const apply = Math.min(inv.pending_amount ?? 0, remaining);
    remaining = to2(remaining - apply);
    return { ...inv, apply_amount: to2(apply) };
  });
}
