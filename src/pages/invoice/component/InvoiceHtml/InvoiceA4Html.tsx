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

export const InvoiceA4Html = ({
  invoice,
}: {
  invoice: InvoiceWithRelations;
}) => {
  const items = invoice?.Items || [];

  console.log(items);

  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white text-[10pt] text-gray-900 border border-gray-300 p-[20px] font-sans leading-relaxed">
      {/* === TOP BAR === */}
      <div className="flex justify-between items-center text-[10pt] mb-[4px]">
        <span className="font-semibold tracking-wide">TAX INVOICE</span>
        <span className="bg-gray-200 px-2 py-[2px] rounded text-[9pt] font-medium">
          ORIGINAL FOR RECIPIENT
        </span>
      </div>

      {/* === COMPANY DETAILS (OWN ROW) === */}
      <div className="flex justify-between items-start border-t-[2px] border-b-[2px] border-black py-2 mb-3">
        {/* Company Left Side */}
        <div className="flex gap-3 text-left items-start">
          <div className="w-[50px] h-[50px] bg-orange-500 text-white text-[16pt] font-bold flex items-center justify-center rounded">
            JSE
          </div>
          <div className="leading-tight">
            <div className="text-[12pt] font-bold">JSE Dyeing Works</div>
            <div>1/723 Mugambigai Nagar, Tamil Nadu</div>
            <div>Mobile: 7904867104</div>
          </div>
        </div>
      </div>

      {/* === INVOICE META (NEW ROW BELOW COMPANY DETAILS) === */}
      <div className="flex justify-between border-b border-black pb-2 mb-3 text-[9.5pt]">
        <div>
          <span className="font-semibold">Invoice No:</span>{" "}
          {invoice.invoice_number || "—"}
        </div>
        <div>
          <span className="font-semibold">Invoice Date:</span>{" "}
          {invoice.invoice_date ? formatDate(invoice.invoice_date) : "—"}
        </div>
        <div>
          <span className="font-semibold">Due Date:</span>{" "}
          {invoice.due_date ? formatDate(invoice.due_date) : "—"}
        </div>
      </div>

      {/* === BILL TO === */}
      <div className="mt-2 mb-3 text-left">
        <div className="font-semibold text-[10.5pt] mb-[3px]">BILL TO</div>
        <div className="font-bold">
          {invoice.customer?.customer_name || "—"}
        </div>
        <div>{invoice.customer?.customer_address || "—"}</div>
        <div>Mobile: {invoice.customer?.customer_mobile || "—"}</div>
      </div>

      {/* <div className="border-t-[2px] border-black my-[5px]"></div> */}

      {/* === ITEMS TABLE === */}
      {/* === ITEMS TABLE === */}
      <table className="w-full border-t border-b border-black text-[9.5pt] mb-4 border-collapse">
        <thead className="border-b border-black bg-gray-100 font-semibold">
          <tr>
            <th className="text-left py-1 px-2 w-[40%]">ITEMS</th>
            <th className="text-center py-1 px-2 w-[15%]">QTY.</th>
            <th className="text-center py-1 px-2 w-[15%]">RATE</th>
            <th className="text-center py-1 px-2 w-[15%]">TAX</th>
            <th className="text-right py-1 px-2 w-[15%]">AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 text-left leading-tight"
            >
              <td className="px-2 py-[2px]">
                <div>{item.item?.item_name || "—"}</div>
                {item.description && (
                  <div className="text-gray-600 text-[8.5pt] mt-[1px]">
                    {item.description}
                  </div>
                )}
              </td>
              <td className="text-center px-2 py-[2px]">{item.quantity}</td>
              <td className="text-center px-2 py-[2px]">
                ₹{Number(item.price ?? 0).toFixed(2)}
              </td>
              <td className="text-center px-2 py-[2px]">
                <div>₹{Number(item.item_tax_amount ?? 0).toFixed(2)}</div>
                <div>
                  {" "}
                  ({item.item_tax_per ?? 0}
                  %)
                </div>
              </td>
              <td className="text-right px-2 py-[2px]">
                ₹{Number(item.amount ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}

          {/* === SUBTOTAL ROW === */}
          <tr className="font-semibold bg-gray-100 border-t-2 border-black">
            <td className="text-left px-2 py-[4px]">SUBTOTAL</td>
            <td className="text-center px-2 py-[4px]">
              {invoice.invoice_total_quantity}
            </td>
            <td></td>
            <td className="text-center px-2 py-[4px]">
              ₹{invoice.invoice_taxable_value ?? "0.00"}
            </td>
            <td className="text-right px-2 py-[4px]">
              ₹{invoice.invoice_total ?? "0.00"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* <div className="border-t-[2px] border-black my-[5px]"></div> */}

      {/* === BOTTOM SECTION === */}
      <div className="flex justify-between items-start gap-10 mt-6">
        {/* LEFT COLUMN: BANK + TERMS */}
        <div className="flex-1 text-left">
          <div className="font-semibold mb-1">BANK DETAILS</div>
          <div>Name: prabhu</div>
          <div>IFSC Code: ICICI0004924</div>
          <div>Account No: 123456543</div>
          <div>Bank: Tirupur</div>

          <div className="font-semibold mt-4 mb-1">TERMS AND CONDITIONS</div>
          <div className="text-[9.5pt] leading-snug text-left">
            1. Goods once sold will not be taken back or exchanged. <br />
            2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction
            only.
          </div>
        </div>

        {/* RIGHT COLUMN: TOTALS */}
        <div className="w-[250px] border border-gray-300 text-[9.5pt] rounded text-left">
          <div className="flex justify-between px-3 py-1 border-b border-gray-200">
            <span>Taxable Amount</span>
            <span>₹{invoice.invoice_taxable_value ?? "0.00"}</span>
          </div>
          <div className="flex justify-between px-3 py-1">
            <span>
              CGST @
              {((Number(invoice.invoice_taxable_value) || 0) / 2).toFixed(2)}%
            </span>
            <span>₹{invoice.invoice_cgst ?? "0.00"}</span>
          </div>
          <div className="flex justify-between px-3 py-1">
            <span>
              SGST @
              {((Number(invoice.invoice_taxable_value) || 0) / 2).toFixed(2)}%%
            </span>
            <span>₹{invoice.invoice_sgst ?? "0.00"}</span>
          </div>
          <div className="border-t border-gray-300 my-1"></div>
          <div className="flex justify-between px-3 py-1 font-semibold">
            <span>Total Amount</span>
            <span>₹{invoice.invoice_total ?? "0.00"}</span>
          </div>
          <div className="border-t border-gray-300 my-1"></div>
          <div className="flex justify-between px-3 py-1">
            <span>Received Amount</span>
            <span>₹{invoice.amount_received ?? "0.00"}</span>
          </div>
          <div className="px-3 py-2 border-t border-gray-200 text-gray-700">
            <div className="font-medium">Total Amount (in words)</div>
            <div className="text-[9pt]">Two Hundred Twenty Rupees</div>
          </div>
        </div>
      </div>
    </div>
  );
};
