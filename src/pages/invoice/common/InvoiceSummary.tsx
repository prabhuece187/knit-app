"use client";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { RootState, AppDispatch } from "@/store/Store";
import { updateField } from "@/slice/InvoiceFormSlice";
import {
  selectInvoiceQtyTotal,
  selectInvoiceSubtotal,
  selectInvoiceTaxSplit,
  selectInvoiceTotal,
} from "@/utility/invoice-selectors";

export function InvoiceSummary() {
  const dispatch = useDispatch<AppDispatch>();

  // ---------------- Derived Values ----------------
  const invoice_subtotal = useSelector(selectInvoiceSubtotal) ?? 0;
  const {
    invoice_sgst = 0,
    invoice_cgst = 0,
    invoice_igst = 0,
    invoice_taxable_value = 0,
  } = useSelector(selectInvoiceTaxSplit) ?? {};

  // ✅ get both total and auto round-off difference
  const { total: invoice_total, roundOffAmount: autoRoundOffAmount } =
    useSelector(selectInvoiceTotal);

  const invoice_total_quantity = useSelector(selectInvoiceQtyTotal) ?? 0;

  // Get current invoice form data
  const invoiceForm = useSelector((state: RootState) => state.invoiceForm);
  const {
    invoice_details = [],
    amount_received = 0,
    round_off = false,
    round_off_type = "+add",
    round_off_amount = 0,
  } = invoiceForm;

  // Compute balance dynamically
  const balance_amount =
    Number(invoice_total ?? 0) - Number(amount_received ?? 0);

  // ---------------- Auto Sync to Redux ----------------
  useEffect(() => {
    if (invoice_details.length > 0) {
      dispatch(
        updateField({ field: "invoice_subtotal", value: invoice_subtotal })
      );
      dispatch(updateField({ field: "invoice_sgst", value: invoice_sgst }));
      dispatch(updateField({ field: "invoice_cgst", value: invoice_cgst }));
      dispatch(updateField({ field: "invoice_igst", value: invoice_igst }));
      dispatch(updateField({ field: "invoice_total", value: invoice_total }));
      dispatch(
        updateField({
          field: "invoice_taxable_value",
          value: invoice_taxable_value,
        })
      );
      dispatch(
        updateField({
          field: "invoice_total_quantity",
          value: invoice_total_quantity,
        })
      );

      // Sync amount & balance
      dispatch(
        updateField({ field: "amount_received", value: amount_received })
      );
      dispatch(updateField({ field: "balance_amount", value: balance_amount }));

      // ✅ Auto round-off
      if (round_off === true) {
        dispatch(
          updateField({
            field: "round_off_amount",
            value: autoRoundOffAmount,
          })
        );
      }
    }
  }, [
    dispatch,
    invoice_details,
    invoice_subtotal,
    invoice_sgst,
    invoice_cgst,
    invoice_igst,
    invoice_total,
    amount_received,
    balance_amount,
    round_off,
    autoRoundOffAmount,
    invoice_total_quantity,
    invoice_taxable_value,
  ]);

  // ---------------- Format Helpers ----------------
  const fmt = (n: number) => Number(n || 0).toFixed(2);
  const displayNumber = (n: number) => (n === 0 ? "" : String(n));

  // ---------------- Handlers ----------------
  const handleFullyPaid = useCallback(
    (checked: boolean) => {
      dispatch(
        updateField({
          field: "amount_received",
          value: checked ? invoice_total : 0,
        })
      );
    },
    [dispatch, invoice_total]
  );

  const handleAutoRoundOff = useCallback(
    (checked: boolean) => {
      dispatch(updateField({ field: "round_off", value: checked }));
    },
    [dispatch]
  );

  const handleRoundOffChange = useCallback(
    (val: string) => {
      if (val === "" || /^\d*\.?\d*$/.test(val)) {
        const parsed = val === "" ? 0 : parseFloat(val);
        dispatch(
          updateField({
            field: "round_off_amount",
            value: Number.isFinite(parsed) ? parsed : 0,
          })
        );
      }
    },
    [dispatch]
  );

  const handleTypeChange = useCallback(
    (val: string) => {
      dispatch(updateField({ field: "round_off_type", value: val }));
    },
    [dispatch]
  );

  const handleAmountReceivedChange = useCallback(
    (val: string) => {
      if (val === "" || /^\d*\.?\d*$/.test(val)) {
        const parsed = val === "" ? 0 : parseFloat(val);
        dispatch(
          updateField({
            field: "amount_received",
            value: Number.isFinite(parsed) ? parsed : 0,
          })
        );
      }
    },
    [dispatch]
  );

  // ---------------- UI ----------------
  return (
    <div className="p-4 border rounded space-y-4 bg-white shadow-sm">
      {/* Totals Section */}
      <div className="flex justify-between">
        <span>Taxable Value</span>
        <span>₹{fmt(invoice_subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>SGST</span>
        <span>₹{fmt(invoice_sgst)}</span>
      </div>
      <div className="flex justify-between">
        <span>CGST</span>
        <span>₹{fmt(invoice_cgst)}</span>
      </div>
      <div className="flex justify-between">
        <span>IGST</span>
        <span>₹{fmt(invoice_igst)}</span>
      </div>

      {/* Round Off Section */}
      <div className="flex items-center justify-between font-semibold pt-2 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={Boolean(round_off)}
            onCheckedChange={(c) => handleAutoRoundOff(Boolean(c))}
          />
          <span>Auto Round Off</span>
        </div>

        {!round_off && (
          <div className="flex items-center gap-2">
            <Select value={round_off_type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+add">+Add</SelectItem>
                <SelectItem value="-remove">-Remove</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              className="w-32"
              value={displayNumber(round_off_amount)}
              onChange={(e) => handleRoundOffChange(e.target.value)}
              placeholder="Amount"
            />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between font-semibold pt-2 border-t">
        <span>Total</span>
        <span>₹{fmt(invoice_total)}</span>
      </div>

      {/* Amount Received */}
      <div className="flex justify-between items-center">
        <span>Amount Received</span>
        <Input
          type="text"
          step="0.01"
          className="w-32"
          value={displayNumber(amount_received)}
          onChange={(e) => handleAmountReceivedChange(e.target.value)}
        />
      </div>

      {/* Fully Paid Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            Number(amount_received) === Number(invoice_total) &&
            invoice_total > 0
          }
          onCheckedChange={(c) => handleFullyPaid(Boolean(c))}
        />
        <span>Fully Paid</span>
      </div>

      {/* Balance */}
      <div className="flex justify-between font-bold text-green-600">
        <span>Balance Amount</span>
        <span>₹{fmt(balance_amount)}</span>
      </div>
    </div>
  );
}
