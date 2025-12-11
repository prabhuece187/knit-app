"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { formatDate, to2 } from "@/utility/utility";
import type { InvoiceItemFrontend } from "@/utility/payment-utils";

interface Props {
  invoices: InvoiceItemFrontend[];
  totalAmount: number;
  onInvoiceToggle: (id: number, checked: boolean) => void;
  onAmountChange: (id: number, amount: number) => void;
}

export function InvoiceSettlementTable({
  invoices,
  totalAmount,
  onInvoiceToggle,
  onAmountChange,
}: Props) {
  const totalApplied = invoices.reduce(
    (sum, inv) => sum + (inv.apply_amount ?? 0),
    0
  );

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="text-lg font-bold text-gray-800">Invoice Settlement</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>

          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="py-2 px-3 text-center font-semibold text-gray-600">
                Select
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-600">
                Invoice Date
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-600">
                Invoice No
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-600">
                Invoice Amount
              </th>
              <th className="py-2 px-3 text-left font-semibold text-gray-600">
                Pending Amount
              </th>
              <th className="py-2 px-3 text-right font-semibold text-gray-600">
                Amount Settled
              </th>
              <th className="py-2 px-3 text-right font-semibold text-gray-600">
                Remaining Balance
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-3 px-3 text-center text-gray-500">
                  No pending invoices found for this customer.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const remaining = to2(
                  (inv.pending_amount ?? 0) - (inv.apply_amount ?? 0)
                );
                const overApplied =
                  inv.apply_amount &&
                  inv.apply_amount > (inv.pending_amount ?? 0);

                return (
                  <tr
                    key={inv.id}
                    className={`border-b border-gray-100 ${
                      inv.is_selected ? "bg-blue-50/50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-3 text-center">
                      <Checkbox
                        checked={inv.is_selected}
                        onCheckedChange={(v) => onInvoiceToggle(inv.id, !!v)}
                      />
                    </td>

                    <td className="py-2 px-3 text-left font-medium text-gray-700">
                      {formatDate(inv.invoice_date)}
                    </td>

                    <td className="py-2 px-3 text-left font-medium text-gray-700">
                      {inv.invoice_number}
                    </td>

                    <td className="py-2 px-3 text-left font-mono text-gray-700">
                      ₹{inv.invoice_total || 0}
                    </td>

                    <td className="py-2 px-3 text-left font-mono text-gray-700">
                      ₹{inv.pending_amount || 0}
                    </td>

                    <td className="py-2 px-3 text-right font-mono">
                      <Input
                        type="number"
                        className={`text-right ${
                          overApplied ? "bg-red-100" : ""
                        }`}
                        value={inv.apply_amount ?? 0}
                        onChange={(e) =>
                          onAmountChange(inv.id, Number(e.target.value))
                        }
                      />
                    </td>

                    <td
                      className={`py-2 px-3 text-right font-mono ${
                        remaining < 0
                          ? "text-red-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      ₹{remaining}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-700">
            <tr>
              <td colSpan={5} className="py-2 px-3 text-right">
                Total Applied:
              </td>
              <td className="py-2 px-3 text-right">₹{to2(totalApplied)}</td>
              <td className="py-2 px-3 text-right">
                ₹{to2(totalAmount - totalApplied)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
