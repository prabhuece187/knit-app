import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { usePostCustomerIndividualItemMutation } from "@/api/ReportApi";
import { Search } from "lucide-react";
import { useState } from "react"; // ⬅️ add useEffect
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useGetItemListQuery } from "@/api/ItemApi";

type CustomerLedger = {
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  customer_address: string;
};

type ReportRow = {
  date: string;
  type: string;
  dc_no?: string;
  qty_in: number;
  qty_out: number;
  closing_qty: number;
  wt_in: number;
  wt_out: number;
  closing_weight: number;
};

type Item = {
  id: number;
  item_name: string;
};

type PrintFormat = "A4" | "A5" | "Thermal";
type Props = { id: number };

export default function CustomerIndividualItem({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [customerData, setCustomerData] = useState<CustomerLedger>();
  const [ItemData, setItemData] = useState<Item>();
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [CustomerLedgerInOutItemWise] = usePostCustomerIndividualItemMutation();
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  // ⬇️ NEW: items + selected item
  const { data: items = [] } = useGetItemListQuery("") as {
    data: Item[];
  };
  const [itemId, setItemId] = useState<number | undefined>(); // "" = All

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const item_id = formData.get("item_id") as string; // ⬅️ NEW

    const requestBody = {
      from,
      to,
      id,
      item_id: item_id || null, // send null for "All"
    };

    try {
      const response = await CustomerLedgerInOutItemWise(requestBody).unwrap();
      setReportData(response.ledger);
      setCustomerData(response.customer);
      setItemData(response.item);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => window.print();

  return (
    <>
      {/* Form + Search */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        {/* Hidden inputs */}
        <input
          type="hidden"
          name="from"
          value={range?.from ? format(range.from, "yyyy-MM-dd") : ""}
        />
        <input
          type="hidden"
          name="to"
          value={range?.to ? format(range.to, "yyyy-MM-dd") : ""}
        />
        <input type="hidden" name="id" value={id} />

        {/* ⬇️ NEW: item_id hidden (keeps value in form submit) */}
        <input type="hidden" name="item_id" value={itemId} />

        {/* Date range */}
        <DateRangePicker value={range} onChange={setRange} />

        {/* ⬇️ NEW: Item select */}
        <select
          className="border rounded p-1 text-xs"
          value={itemId}
          onChange={(e) => setItemId(Number(e.target.value) || undefined)}
          aria-label="Item"
        >
          <option value="">All Items</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.item_name}
            </option>
          ))}
        </select>

        {/* Search */}
        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Print format + Print */}
        <div className="mb-4 flex gap-3 text-xs">
          <select
            id="printFormat"
            className="border rounded p-1"
            value={printFormat}
            onChange={(e) => setPrintFormat(e.target.value as PrintFormat)}
          >
            <option value="A4">A4 (210mm x 297mm)</option>
            <option value="A5">A5 (148mm x 210mm)</option>
            <option value="Thermal">Thermal (80mm)</option>
          </select>

          <Button
            onClick={onPrint}
            className="text-xs"
            variant="outline"
            size="sm"
          >
            Print Report
          </Button>
        </div>
      </form>

      {/* Report */}
      <div
        id="printable-area"
        className={`print-container print-${printFormat.toLowerCase()}`}
      >
        <div className="flex justify-between mb-6">
          {/* Customer */}
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="text-xs font-bold">Customer :</span>{" "}
              {customerData?.customer_name}
            </p>
            {/* ⬇️ NEW: Show selected item */}
            <p className="text-xs">
              <span className="text-xs font-bold">Item :</span>{" "}
              {ItemData?.item_name || "-"}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Mobile :</span>{" "}
              {customerData?.customer_mobile}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Email :</span>{" "}
              {customerData?.customer_email}
            </p>
          </div>

          {/* Company + Filters */}
          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Report :</span> Customer
              In/Outward Ledger
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">From Date :</span>{" "}
              {range?.from ? format(range.from, "dd-MM-yyyy") : "-"}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">To Date :</span>{" "}
              {range?.to ? format(range.to, "dd-MM-yyyy") : "-"}
            </p>
          </div>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Dc No</th>
              <th className="border p-2 text-right">Qty In</th>
              <th className="border p-2 text-right">Qty Out</th>
              <th className="border p-2 text-right">Closing Qty</th>
              <th className="border p-2 text-right">Weight In</th>
              <th className="border p-2 text-right">Weight Out</th>
              <th className="border p-2 text-right">Closing Weight</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.date}</td>
                  <td className="border p-2">{row.type}</td>
                  <td className="border p-2">
                    {row.type === "Opening Balance"
                      ? "-"
                      : row.type === "Inward"
                      ? `In-${row.dc_no ?? "-"}`
                      : `Out-${row.dc_no ?? "-"}`}
                  </td>
                  <td className="border p-2 text-right">{row.qty_in}</td>
                  <td className="border p-2 text-right">{row.qty_out}</td>
                  <td className="border p-2 text-right">{row.closing_qty}</td>
                  <td className="border p-2 text-right">{row.wt_in}</td>
                  <td className="border p-2 text-right">{row.wt_out}</td>
                  <td className="border p-2 text-right">
                    {row.closing_weight}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
