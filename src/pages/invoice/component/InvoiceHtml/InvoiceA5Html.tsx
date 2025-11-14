import type { Invoice } from "@/schema-types/invoice-schema";
import { amountInWords, formatDate } from "@/utility/utility";

interface InvoiceItem {
  id: number;
  description?: string;
  item?: {
    id: number;
    item_name?: string;
  };
  hsn_code?: string;
  quantity?: number;
  price?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
  amount?: number;
}

interface InvoiceCustomer {
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
}

export interface InvoiceTax {
  id: number;
  user_id: number;
  invoice_id: number;
  tax_type: "CGST" | "SGST" | "IGST";
  tax_rate: string;
  tax_amount: string;
}

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  Items?: InvoiceItem[];
  InvoiceTaxes?: InvoiceTax[];
}

export const InvoiceA5Html = ({
  invoice,
}: {
  invoice: InvoiceWithRelations;
}) => {
  const items = invoice?.Items || [];

  return (
    <div className="w-[148mm] min-h-[210mm] mx-auto bg-white text-[9pt] text-gray-900 border border-gray-300 p-[14px] font-sans leading-relaxed">
      {/* === HEADER === */}
      <div className="flex justify-between items-center mb-[4px] text-[9pt]">
        <span className="font-semibold tracking-wide">TAX INVOICE</span>
        <span className="bg-gray-200 px-2 py-[1px] rounded text-[8pt] font-medium">
          ORIGINAL
        </span>
      </div>

      {/* === COMPANY INFO === */}
      <div className="flex items-start border-t-[1.5px] border-b-[1.5px] border-black py-[4px] mb-[6px]">
        <div className="flex items-start gap-2">
          <div className="w-[40px] h-[40px] bg-orange-500 text-white text-[13pt] font-bold flex items-center justify-center rounded">
            JSE
          </div>
          <div className="leading-tight text-left">
            <div className="text-[11pt] font-bold">JSE Dyeing Works</div>
            <div>1/723 Mugambigai Nagar, Tamil Nadu</div>
            <div>Mobile: 7904867104</div>
          </div>
        </div>
      </div>

      {/* === INVOICE META === */}
      <div className="flex justify-between border-b border-black pb-[3px] mb-[5px] text-[8.5pt]">
        <div>
          <span className="font-semibold">Inv No:</span>{" "}
          {invoice.invoice_number || "—"}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{" "}
          {invoice.invoice_date ? formatDate(invoice.invoice_date) : "—"}
        </div>
        <div>
          <span className="font-semibold">Due:</span>{" "}
          {invoice.due_date ? formatDate(invoice.due_date) : "—"}
        </div>
      </div>

      {/* === BILL TO === */}
      <div className="mb-[6px] text-left">
        <div className="font-semibold text-[9.5pt] mb-[2px]">BILL TO</div>
        <div className="font-bold">
          {invoice.customer?.customer_name || "—"}
        </div>
        <div>{invoice.customer?.customer_address || "—"}</div>
        <div>Mobile: {invoice.customer?.customer_mobile || "—"}</div>
      </div>

      {/* === ITEMS TABLE === */}
      <table className="w-full border-t border-b border-black text-[8.5pt] mb-[6px] border-collapse">
        <thead className="border-b border-black bg-gray-100 font-semibold">
          <tr>
            <th className="text-left px-2 py-[2px] w-[38%]">ITEMS</th>
            <th className="text-center px-2 py-[2px] w-[14%]">QTY</th>
            <th className="text-center px-2 py-[2px] w-[14%]">RATE</th>
            <th className="text-center px-2 py-[2px] w-[14%]">TAX</th>
            <th className="text-right px-2 py-[2px] w-[20%]">AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-200 leading-tight">
              <td className="px-2 py-[1px] text-left">
                {item.item?.item_name || "—"}
                {item.description && (
                  <div className="text-gray-600 text-[7.5pt] mt-[1px]">
                    {item.description}
                  </div>
                )}
              </td>
              <td className="text-center px-2 py-[1px]">{item.quantity}</td>
              <td className="text-center px-2 py-[1px]">
                ₹{Number(item.price ?? 0).toFixed(2)}
              </td>
              <td className="text-center px-2 py-[1px]">
                ₹{Number(item.item_tax_amount ?? 0).toFixed(2)} <br />(
                {item.item_tax_per ?? 0}%)
              </td>
              <td className="text-right px-2 py-[1px]">
                ₹{Number(item.amount ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}

          {/* === SUBTOTAL ROW === */}
          <tr className="font-semibold bg-gray-100 border-t border-black">
            <td className="text-left px-2 py-[3px]">SUBTOTAL</td>
            <td className="text-center px-2 py-[3px]">
              {invoice.invoice_total_quantity}
            </td>
            <td></td>
            <td className="text-center px-2 py-[3px]">
              ₹{invoice.invoice_taxable_value ?? "0.00"}
            </td>
            <td className="text-right px-2 py-[3px]">
              ₹{invoice.invoice_total ?? "0.00"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* === FOOTER === */}
      <div className="flex justify-between items-start gap-6 mt-3">
        {/* LEFT SIDE: BANK + TERMS */}
        <div className="flex-1 text-left">
          <div className="font-semibold mb-[2px]">BANK DETAILS</div>
          <div>Name: Prabhu</div>
          <div>IFSC: ICICI0004924</div>
          <div>Acc No: 123456543</div>
          <div>Bank: Tirupur</div>

          <div className="font-semibold mt-[6px] mb-[2px]">
            TERMS & CONDITIONS
          </div>
          <div className="text-[8pt] leading-snug">
            1. Goods once sold will not be taken back or exchanged. <br />
            2. All disputes are subject to Tirupur jurisdiction only.
          </div>
        </div>

        {/* RIGHT SIDE: TOTALS */}
        <div className="w-[180px] border border-gray-300 rounded text-[8.5pt]">
          <div className="flex justify-between px-2 py-[2px] border-b border-gray-200">
            <span>Taxable</span>
            <span>₹{invoice.invoice_taxable_value ?? "0.00"}</span>
          </div>
          {/* Group and show taxes */}
          {(() => {
            const taxes = invoice.InvoiceTaxes || [];

            // Group all tax types (SGST, CGST, IGST) by rate
            const grouped = taxes.reduce((acc, t) => {
              const rate = parseFloat(t.tax_rate) || 0;
              if (!acc[rate]) acc[rate] = { CGST: 0, SGST: 0, IGST: 0 };
              acc[rate][t.tax_type] = parseFloat(t.tax_amount) || 0;
              return acc;
            }, {} as Record<number, { CGST: number; SGST: number; IGST: number }>);

            return Object.entries(grouped)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([rate, values]) => {
                const isIGST = values.IGST > 0;
                return (
                  <div
                    key={rate}
                    className="border-b border-gray-100 last:border-0"
                  >
                    {isIGST ? (
                      <div className="flex justify-between px-3 py-1">
                        <span>IGST @{rate}%</span>
                        <span>₹{values.IGST.toFixed(2)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between px-3 py-1">
                          <span>CGST @{rate}%</span>
                          <span>₹{values.CGST.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between px-3 py-1">
                          <span>SGST @{rate}%</span>
                          <span>₹{values.SGST.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              });
          })()}
          <div className="border-t border-gray-300 my-[2px]"></div>
          <div className="flex justify-between px-2 py-[2px] font-semibold">
            <span>Total</span>
            <span>₹{invoice.invoice_total ?? "0.00"}</span>
          </div>
          <div className="flex justify-between px-2 py-[2px] border-t border-gray-300">
            <span>Received</span>
            <span>₹{invoice.amount_received ?? "0.00"}</span>
          </div>
          <div className="px-2 py-[3px] border-t border-gray-200 text-gray-700">
            <div className="font-medium">Amount (in words)</div>
            <div className="text-[8pt]">
              {amountInWords(Number(invoice.invoice_total ?? 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
