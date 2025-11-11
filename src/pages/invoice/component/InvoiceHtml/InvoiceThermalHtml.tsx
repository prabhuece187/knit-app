import type { Invoice } from "@/schema-types/invoice-schema";
import { formatDate } from "@/utility/utility";

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

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  Items?: InvoiceItem[];
}

export const InvoiceThermalHtml = ({
  invoice,
}: {
  invoice: InvoiceWithRelations;
}) => {
  const items = invoice?.Items || [];

  return (
    <div className="w-[80mm] mx-auto text-[9pt] leading-tight text-gray-900 font-sans bg-white p-2">
      {/* === HEADER === */}
      <div className="text-center border-b border-black pb-1 mb-1">
        <div className="font-bold text-[11pt]">TAX INVOICE</div>
        <div className="font-semibold text-[10pt] mt-[1px]">
          JSE Dyeing Works
        </div>
        <div className="text-[8.5pt]">
          1/723 Mugambigai Nagar, Tamil Nadu
          <br />
          Ph: 7904867104
        </div>
      </div>

      {/* === INVOICE INFO === */}
      <div className="text-[8.5pt] text-left mb-2 border-b border-dashed border-gray-400 pb-1">
        <div>Invoice No: {invoice.invoice_number || "—"}</div>
        <div>Invoice Date: {formatDate(invoice.invoice_date)}</div>
        <div>Due Date: {formatDate(invoice.due_date)}</div>
      </div>

      {/* === CUSTOMER === */}
      <div className="text-[8.5pt] text-left mb-2 border-b border-dashed border-gray-400 pb-1">
        <div className="font-semibold">Bill To:</div>
        <div className="font-bold">
          {invoice.customer?.customer_name || "—"}
        </div>
        <div>{invoice.customer?.customer_address || "—"}</div>
        <div>Mob: {invoice.customer?.customer_mobile || "—"}</div>
      </div>

      {/* === ITEMS TABLE === */}
      <table className="w-full text-[8pt] border-b border-dashed border-gray-400 mb-2">
        <thead className="border-b border-black">
          <tr>
            <th className="text-left py-[2px]">Item</th>
            <th className="text-right py-[2px]">Amt</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="align-top">
              <td className="pr-2 py-[2px]">
                <div>{item.item?.item_name || "—"}</div>
                <div className="text-[7pt] text-left text-gray-600">
                  {item.quantity} × ₹{Number(item.price ?? 0).toFixed(2)} = ₹
                  {Number(item.amount ?? 0).toFixed(2)}
                </div>
                <div className="text-[7pt] text-left text-gray-600">
                  Tax: {item.item_tax_per ?? 0}% (₹
                  {Number(item.item_tax_amount ?? 0).toFixed(2)})
                </div>
              </td>
              <td className="text-right py-[2px]">
                ₹{Number(item.amount ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === TOTALS === */}
      <div className="text-[8.5pt] border-b border-dashed border-gray-400 pb-1 mb-1">
        <div className="flex justify-between">
          <span>Taxable Amount</span>
          <span>₹{invoice.invoice_taxable_value ?? "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>CGST</span>
          <span>₹{invoice.invoice_cgst ?? "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST</span>
          <span>₹{invoice.invoice_sgst ?? "0.00"}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{invoice.invoice_total ?? "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Received</span>
          <span>₹{invoice.amount_received ?? "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance</span>
          <span>
            ₹
            {(
              (Number(invoice.invoice_total) || 0) -
              (Number(invoice.amount_received) || 0)
            ).toFixed(2)}
          </span>
        </div>
      </div>

      {/* === FOOTER === */}
      <div className="text-[7.5pt] leading-snug mb-1">
        <div className="font-semibold">Terms & Conditions:</div>
        <div>1. Goods once sold will not be taken back or exchanged.</div>
        <div>2. All disputes are subject to Tirupur jurisdiction only.</div>
      </div>

      <div className="text-center text-[8pt] border-t border-black pt-1 mt-2">
        Thank you! Visit Again.
      </div>
    </div>
  );
};
