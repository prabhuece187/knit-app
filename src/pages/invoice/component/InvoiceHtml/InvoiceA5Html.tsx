import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- MOCKED INTERFACES ---
interface Invoice {
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  invoice_total_quantity?: number;
  invoice_total?: number;
  amount_received?: number;
  challan_number?: string;
  po_number?: string;
  eway_bill_number?: string;
}

interface InvoiceItem {
  id: number;
  item?: { item_name?: string };
  description?: string;
  hsn_code?: string;
  quantity?: number;
  unit?: string;
  price?: number;
  amount?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
}

interface InvoiceCustomer {
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
  gstin?: string;
}

interface InvoiceTax {
  tax_type: "CGST" | "SGST" | "IGST";
  tax_rate: number | string;
  tax_amount: number | string;
}

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  ship_to?: InvoiceCustomer;
  Items?: InvoiceItem[];
  InvoiceTaxes?: InvoiceTax[];
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  gstin?: string;
  pan?: string;
}

// --- MOCKED UTILITY FUNCTIONS ---

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const money = (v: number | string | null | undefined) => {
  if (v === null || v === undefined) return "0.00";

  const n = Number(v);

  if (typeof n !== "number" || isNaN(n)) return "0.00";

  return n.toFixed(2);
};

// --- INVOICE COMPONENT ---

export const InvoiceA5Html = ({
  invoice,
}: {
  invoice: InvoiceWithRelations | null | undefined;
}) => {
  if (!invoice) {
    return (
      <div className="w-[210mm] min-h-[148mm] mx-auto bg-white p-4 text-[9pt] leading-tight border rounded flex items-center justify-center">
        <div className="text-gray-500 font-semibold p-10">
          Loading invoice data...
        </div>
      </div>
    );
  }

  const items = invoice.Items || [];

  // Calculate total tax per item and split into CGST/SGST for display
  const itemsWithCalculatedTax = items.map((item) => ({
    ...item,
    individual_tax: (item.item_tax_amount || 0) / 2, // Total tax is split equally
  }));

  return (
    <div className="w-[210mm] min-h-[148mm] mx-auto bg-white p-4 text-[9pt] leading-tight border border-gray-400 rounded shadow-lg">
      {/* TOP HEADER ROW */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="text-[11pt] font-extrabold text-gray-800">
            TAX INVOICE
          </div>
          <div className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-sm text-[8pt] font-semibold border border-gray-400">
            ORIGINAL FOR RECIPIENT
          </div>
        </div>
        <div className="text-[9pt] font-medium text-gray-600 mt-0.5">
          Most affordable Hardware store in town
        </div>
      </div>

      {/* SECTION 1 - COMPANY INFO + INVOICE META GRID - ENSURING EQUAL HEIGHT */}
      <div className="border border-gray-400 rounded-lg grid grid-cols-3">
        {/* LEFT LOGO + COMPANY DETAILS (2/3 width) */}
        <div className="col-span-2 flex gap-3 p-2 pr-3 border-r border-gray-400">
          <div className="w-16 h-16 bg-white border border-gray-300 flex-shrink-0">
            {/* Placeholder for Logo/Image */}
            <img
              src="https://placehold.co/64x64/E0F2F1/00796B?text=IMG"
              alt="Company Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/64x64/E0F2F1/00796B?text=IMG";
              }}
            />
          </div>
          <div className="text-[8pt]">
            <div className="text-[10pt] font-bold text-gray-900">
              {invoice.company_name}
            </div>
            <div className="text-[7pt] text-gray-700">
              {invoice.company_address}
            </div>
            <div className="grid grid-cols-2 mt-1 gap-x-2">
              <div className="text-[7pt]">
                <span className="font-semibold">GSTIN:</span> {invoice.gstin}
              </div>
              <div className="text-[7pt]">
                <span className="font-semibold">Mobile:</span>{" "}
                {invoice.company_phone}
              </div>
              <div className="text-[7pt]">
                <span className="font-semibold">PAN:</span> {invoice.pan}
              </div>
              <div className="text-[7pt]">
                <span className="font-semibold">Email:</span> rohitp07@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - INVOICE META BLOCK (1/3 width) - Structured as 3x2 Grid */}
        <div className="col-span-1 text-[7pt] divide-y divide-gray-400">
          {/* Row 1: Invoice No, Date, Due Date - Increased vertical padding (py-2) */}
          <div className="grid grid-cols-3 text-center">
            <div className="border-r border-gray-400 py-2">
              <div className="font-bold text-gray-600">Invoice No.</div>
              <div className="font-black text-gray-900 text-[8pt]">
                {invoice.invoice_number}
              </div>
            </div>
            <div className="border-r border-gray-400 py-2">
              <div className="font-bold text-gray-600">Invoice Date</div>
              <div className="font-semibold text-gray-900">
                {formatDate(invoice.invoice_date)}
              </div>
            </div>
            <div className="py-2">
              <div className="font-bold text-gray-600">Due Date</div>
              <div className="font-semibold text-gray-900">
                {formatDate(invoice.due_date)}
              </div>
            </div>
          </div>
          {/* Row 2: Challan No, P.O. No, E-way Bill No - Increased vertical padding (py-2) */}
          <div className="grid grid-cols-3 text-center">
            <div className="border-r border-gray-400 py-2">
              <div className="font-bold text-gray-600">Challan No.</div>
              <div className="font-semibold text-gray-900">
                {invoice.challan_number || "N/A"}
              </div>
            </div>
            <div className="border-r border-gray-400 py-2">
              <div className="font-bold text-gray-600">P.O. No.</div>
              <div className="font-semibold text-gray-900">
                {invoice.po_number || "N/A"}
              </div>
            </div>
            <div className="py-2">
              <div className="font-bold text-gray-600">E-way Bill No.</div>
              <div className="font-semibold text-gray-900">
                {invoice.eway_bill_number || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BILL TO + SHIP TO */}
      <div className="grid grid-cols-2 mt-3 divide-x divide-gray-400 border border-gray-400 rounded-lg">
        {/* BILL TO */}
        <div className="p-2 text-[8pt]">
          <div className="font-semibold text-left border-b border-gray-300 pb-1 mb-1 text-gray-600">
            BILL TO
          </div>
          <div className="font-bold text-left text-gray-900">
            {invoice.customer?.customer_name || "N/A"}
          </div>
          <div className="text-left text-gray-700">
            {invoice.customer?.customer_address || "N/A"}
          </div>
          <div className="text-left text-gray-700">
            <span className="font-semibold">Mobile:</span>{" "}
            {invoice.customer?.customer_mobile || "N/A"}
          </div>
        </div>

        {/* SHIP TO */}
        <div className="p-2 text-[8pt]">
          <div className="font-semibold text-left border-b border-gray-300 pb-1 mb-1 text-gray-600">
            SHIP TO
          </div>
          <div className="font-bold text-left text-gray-900">
            {invoice.ship_to?.customer_name ||
              invoice.customer?.customer_name ||
              "N/A"}
          </div>
          <div className="text-left text-gray-700">
            {invoice.ship_to?.customer_address ||
              invoice.customer?.customer_address ||
              "N/A"}
          </div>
          <div className="text-left text-gray-700">
            <span className="font-semibold">Mobile:</span>{" "}
            {invoice.ship_to?.customer_mobile ||
              invoice.customer?.customer_mobile ||
              "N/A"}
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full border-t border-gray-700 border-collapse mt-3 text-[8pt]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-700">
            <th className="border-x border-gray-400 px-1 py-1 w-[5%] font-bold">
              S.NO.
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[40%] font-bold text-left">
              ITEMS
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[10%] font-bold">
              HSN
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[10%] font-bold">
              QTY.
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[12%] font-bold">
              SGST
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[12%] font-bold">
              CGST
            </th>
            <th className="border-x border-gray-400 px-1 py-1 w-[11%] font-bold">
              AMOUNT
            </th>
          </tr>
        </thead>

        <tbody>
          {itemsWithCalculatedTax.length > 0 ? (
            itemsWithCalculatedTax.map((it, i) => (
              <tr key={i} className="h-10 align-top">
                <td className="border-x border-gray-300 text-center py-1">
                  {i + 1}
                </td>
                <td className="border-x border-gray-300 px-1 text-left py-1 font-semibold">
                  {it.item?.item_name || it.description || "N/A"}
                </td>
                <td className="border-x border-gray-300 text-right py-1">
                  {it.hsn_code || "-"}
                </td>
                <td className="border-x border-gray-300 text-right py-1">
                  {it.quantity || 0} {it.unit || "PCS"}
                </td>
                <td className="border-x border-gray-300 text-right py-1">
                  <div>{money(it.individual_tax)}</div>
                  {it.item_tax_per !== undefined && (
                    <div className="text-[7pt] text-gray-600">
                      ({it.item_tax_per}%)
                    </div>
                  )}
                </td>
                <td className="border-x border-gray-300 text-right py-1">
                  <div>{money(it.individual_tax)}</div>
                  {it.item_tax_per !== undefined && (
                    <div className="text-[7pt] text-gray-600">
                      ({it.item_tax_per}%)
                    </div>
                  )}
                </td>
                <td className="border-x border-gray-300 text-right font-bold py-1">
                  {money(it.amount)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-20">
              <td
                colSpan={7}
                className="text-center text-gray-500 italic border-x border-gray-300"
              >
                No items listed on this invoice.
              </td>
            </tr>
          )}
        </tbody>

        <tfoot>
          {/* Total row with mandatory top and bottom border */}
          <tr className="bg-gray-100 font-bold border-t border-b border-gray-700">
            <td className="border-x border-gray-400 px-1 py-1"></td>
            <td className="border-x border-gray-400 px-1 py-1 text-right text-gray-800">
              TOTAL
            </td>
            <td className="border-x border-gray-400 px-1 py-1 text-right"></td>
            <td className="border-x border-gray-400 px-1 py-1 text-right text-gray-800">
              {invoice.invoice_total_quantity || 0}
            </td>
            <td className="border-x border-gray-400 px-1 py-1 text-right text-gray-800">
              {money((invoice.invoice_total || 0) * 0.09)}
            </td>
            <td className="border-x border-gray-400 px-1 py-1 text-right text-gray-800">
              {money((invoice.invoice_total || 0) * 0.09)}
            </td>
            <td className="border-x border-gray-400 px-1 py-1 text-right text-indigo-700">
              ₹{money(invoice.invoice_total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* FOOTER ROWS */}
      <div className="grid grid-cols-3 mt-3 text-[8pt] divide-x divide-gray-400 border border-gray-400 rounded-lg overflow-hidden">
        {/* RECEIVED AMOUNT */}
        <div className="p-2 text-left">
          <b className="text-gray-800">Received Amount:</b> ₹
          {money(invoice.amount_received)}
        </div>

        {/* PREVIOUS BALANCE */}
        <div className="p-2 text-left">
          <b className="text-gray-800">Previous Balance:</b> ₹{money(0)}
        </div>

        {/* CURRENT BALANCE */}
        <div className="p-2 text-left">
          <b className="text-gray-800">Current Balance:</b> ₹
          {money((invoice.invoice_total || 0) - (invoice.amount_received || 0))}
        </div>
      </div>

      {/* LAST ROW: Bank, QR, Terms */}
      <div className="grid grid-cols-2 gap-x-2 mt-3">
        {/* LEFT COLUMN: Bank Details & Payment QR (Combined) */}
        <div className="border border-gray-400 p-2 text-[8pt] text-left rounded-lg grid grid-cols-2 divide-x divide-gray-400">
          {/* Bank Details */}
          <div className="pr-2">
            <b className="text-gray-800 block border-b border-gray-300 pb-1 mb-1">
              Bank Details
            </b>
            <div>Name: Prabhu</div>
            <div>IFSC: ICICI0004924</div>
            <div>Acc No: 123456543</div>
            <div>Bank: Tirupur Branch</div>
          </div>

          {/* QR Code/Payment Info */}
          <div className="pl-2 flex flex-col items-center justify-center">
            <b className="text-gray-800 block border-b border-gray-300 pb-1 mb-1 w-full text-center">
              Payment QR Code
            </b>
            <div className="w-16 h-16 bg-gray-300 border border-gray-400 rounded-sm mt-1"></div>
            <span className="text-[7pt] mt-1 text-gray-600">
              Scan for Payment
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Terms & Signature */}
        <div className="border border-gray-400 p-2 text-[8pt] text-left rounded-lg">
          <b className="text-gray-800 block border-b border-gray-300 pb-1 mb-1">
            Terms and Conditions
          </b>
          <div className="text-[7pt]">
            1. Goods once sold will not be taken back.
          </div>
          <div className="text-[7pt]">
            2. All disputes subject to Tirupur jurisdiction.
          </div>

          <div className="mt-4 pt-2 border-t border-gray-300 text-right">
            <div className="h-10 w-full border-b border-dashed border-gray-400 mb-1"></div>
            <p className="font-semibold text-gray-800">
              For {invoice.company_name}
            </p>
            <p className="text-[7pt] text-gray-600">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

const mockInvoiceData: InvoiceWithRelations = {
  invoice_number: "10147",
  invoice_date: "2025-11-17",
  due_date: "2025-12-17",
  challan_number: "CHLN-2025-487",
  po_number: "PN-122",
  eway_bill_number: "223",
  company_name: "Shree Balaji Hardware Store",
  company_address: "Gol Chauraha, Sarafa Bazar, Indore, 452004, Madhya Pradesh",
  company_phone: "5345535555",
  gstin: "09AYTST1022H1ZE",
  pan: "YTERW9603R",
  customer: {
    customer_name: "CASH SALE",
    customer_address: "N/A",
    customer_mobile: "5345535555",
  },
  ship_to: {
    customer_name: "CASH SALE",
    customer_address: "N/A",
    customer_mobile: "5345535555",
  },
  Items: [
    {
      id: 1,
      item: { item_name: "ABRO PTFE SMT" },
      hsn_code: "3920",
      quantity: 8,
      unit: "PCS",
      price: 187.5,
      amount: 1500.0,
      item_tax_per: 6,
      item_tax_amount: 180.0,
    },
    {
      id: 2,
      item: { item_name: "HEATX 500 ML" },
      hsn_code: "3506",
      quantity: 7,
      unit: "PCS",
      price: 260.0,
      amount: 1820.0,
      item_tax_per: 9,
      item_tax_amount: 327.6,
    },
  ],
  InvoiceTaxes: [
    { tax_type: "CGST", tax_rate: 9, tax_amount: 250.17 },
    { tax_type: "SGST", tax_rate: 9, tax_amount: 250.17 },
  ],
  invoice_total_quantity: 15,
  invoice_total: 3780.0,
  amount_received: 0.0,
};

const App = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceWithRelations | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setInvoiceData(mockInvoiceData);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-sans antialiased bg-gray-100 min-h-screen p-4">
      <script src="https://cdn.tailwindcss.com"></script>


      <header className="py-4 mb-4 bg-white shadow-md rounded-xl text-center">
        <h1 className="text-xl font-bold text-gray-700">
          Invoice Layout Match
        </h1>
        <p className="text-sm text-gray-500">
          Top section height equalized for better visual alignment.
        </p>
      </header>

      <InvoiceA5Html invoice={invoiceData} />
    </div>
  );
};

export default App;

if (typeof window !== "undefined") {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
}
