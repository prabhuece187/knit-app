"use client";

import { useEffect } from "react";
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
  const invoiceForm = useSelector((state: RootState) => state.invoiceForm);
  const { amount_received = 0, round_off = false } = invoiceForm;

  // 🧮 All computed values
  const invoice_subtotal = useSelector(selectInvoiceSubtotal);
  const invoice_total_quantity = useSelector(selectInvoiceQtyTotal);
  const {
    invoice_sgst = 0,
    invoice_cgst = 0,
    invoice_taxable_value = 0,
  } = useSelector(selectInvoiceTaxSplit);
  const {
    total: computedInvoiceTotal = 0,
    roundOffAmount = 0,
    roundOffType = "none",
  } = useSelector(selectInvoiceTotal);

  const fmt = (n: number) => n.toFixed(2);

  // ---------------- Handlers ----------------
  const handleFullyPaid = (checked: boolean) =>
    dispatch(
      updateField({
        field: "amount_received",
        value: checked ? computedInvoiceTotal : 0,
      })
    );

  const handleAutoRoundOff = (checked: boolean) =>
    dispatch(updateField({ field: "round_off", value: checked }));

  const handleRoundOffChange = (val: string) => {
    if (/^-?\d*\.?\d*$/.test(val) || val === "") {
      dispatch(
        updateField({
          field: "round_off_amount",
          value: val === "" ? 0 : parseFloat(val),
        })
      );
    }
  };

  const handleTypeChange = (val: string) =>
    dispatch(updateField({ field: "round_off_type", value: val }));

  const handleAmountReceivedChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val) || val === "") {
      dispatch(
        updateField({
          field: "amount_received",
          value: val === "" ? 0 : parseFloat(val),
        })
      );
    }
  };

  const balance = computedInvoiceTotal - (amount_received || 0);

  // ---------------- Auto-sync all totals to Redux ----------------
  useEffect(() => {
    dispatch(
      updateField({
        field: "invoice_total_quantity",
        value: invoice_total_quantity,
      })
    );
    dispatch(
      updateField({ field: "invoice_subtotal", value: invoice_subtotal })
    );
    dispatch(
      updateField({
        field: "invoice_taxable_value",
        value: invoice_taxable_value,
      })
    );
    dispatch(updateField({ field: "invoice_cgst", value: invoice_cgst }));
    dispatch(updateField({ field: "invoice_sgst", value: invoice_sgst }));

    dispatch(
      updateField({ field: "invoice_total", value: computedInvoiceTotal })
    );
    dispatch(updateField({ field: "balance_amount", value: balance }));
    dispatch(updateField({ field: "round_off_amount", value: roundOffAmount }));
    dispatch(updateField({ field: "round_off_type", value: roundOffType }));
  }, [
    invoice_total_quantity,
    invoice_subtotal,
    invoice_taxable_value,
    invoice_cgst,
    invoice_sgst,
    computedInvoiceTotal,
    balance,
    roundOffAmount,
    roundOffType,
    dispatch,
  ]);

  // ---------------- Render ----------------
  return (
    <div className="p-4 border rounded space-y-4 bg-white shadow-sm">
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

      {/* Round Off Section */}
      <div className="flex items-center justify-between font-semibold pt-2 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={!!round_off}
            onCheckedChange={handleAutoRoundOff}
          />
          <span>Auto Round Off</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={invoiceForm.round_off_type || "none"}
            onValueChange={handleTypeChange}
            disabled={!!round_off}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="+add">+Add</SelectItem>
              <SelectItem value="-remove">-Remove</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            className="w-32"
            value={invoiceForm.round_off_amount || ""}
            onChange={(e) => handleRoundOffChange(e.target.value)}
            placeholder="Amount"
            disabled={round_off}
          />
        </div>
      </div>

      <div className="flex justify-between font-semibold pt-2 border-t">
        <span>Total</span>
        <span>₹{fmt(computedInvoiceTotal)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span>Amount Received</span>
        <Input
          type="text"
          step="0.01"
          className="w-32"
          value={amount_received || ""}
          onChange={(e) => handleAmountReceivedChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            amount_received === computedInvoiceTotal && computedInvoiceTotal > 0
          }
          onCheckedChange={handleFullyPaid}
        />
        <span>Fully Paid</span>
      </div>

      <div className="flex justify-between font-bold text-green-600">
        <span>Balance Amount</span>
        <span>₹{fmt(balance)}</span>
      </div>
    </div>
  );
}
