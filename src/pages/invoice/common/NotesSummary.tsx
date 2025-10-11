"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/slice/InvoiceFormSlice";
import type { RootState, AppDispatch } from "@/store/Store";

export function NotesSummary() {
  const dispatch = useDispatch<AppDispatch>();
  const { invoice_notes, invoice_terms } = useSelector(
    (state: RootState) => state.invoiceForm
  );

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Notes & Terms</h3>
      <textarea
        className="border px-2 w-full"
        rows={3}
        placeholder="Invoice Notes"
        value={invoice_notes}
        onChange={(e) =>
          dispatch(
            updateField({ field: "invoice_notes", value: e.target.value })
          )
        }
      />
      <textarea
        className="border px-2 w-full"
        rows={3}
        placeholder="Invoice Terms"
        value={invoice_terms}
        onChange={(e) =>
          dispatch(
            updateField({ field: "invoice_terms", value: e.target.value })
          )
        }
      />
    </div>
  );
}
