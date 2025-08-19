import { useState } from "react";
import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { usePostMillIndividualItemMutation } from "@/api/ReportApi";
import { useGetItemListQuery } from "@/api/ItemApi";

type LedgerRow = {
  date: string;
  dc_no: string;
  type: string;
  qty_in: number;
  wt_in: number;
  qty_out: number;
  wt_out: number;
  closing_qty: number;
  closing_weight: number;
};

type MillLedger = {
  mill_name: string;
  mobile_number?: string;
  address?: string;
};

type Item = {
  id: number;
  item_name: string;
};

type Props = {
  id: number; // passed from parent or route
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function MillItemLedger({ id }: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [millData, setMillData] = useState<MillLedger>();
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");
  const [itemId, setItemId] = useState<number | undefined>();

  const { data: items = [] } = useGetItemListQuery("") as { data: Item[] };
  const [itemData, setItemData] = useState<Item>();

  const [fetchLedger, { isLoading }] = usePostMillIndividualItemMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const from = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
    const to = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

    try {
      const response = await fetchLedger({
        id: id,
        item_id: itemId,
        from,
        to,
      }).unwrap();

      setRows(response.report);
      setMillData(response.mill);
      setItemData(response.item);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Filters */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <select
          className="border rounded p-1 text-xs"
          value={itemId}
          onChange={(e) => setItemId(Number(e.target.value) || undefined)}
          aria-label="Item"
        >
          <option value="">-- Select Item --</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.item_name}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>

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
      </form>

      {/* Report container */}
      <div
        id="printable-area"
        className={`print-container print-${printFormat.toLowerCase()}`}
      >
        {/* Header */}
        <div className="flex justify-between mb-6">
          {/* Mill Info */}
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="font-bold">Mill :</span> {millData?.mill_name}
            </p>
            <p className="text-xs">
              <span className="font-bold">Mobile :</span>{" "}
              {millData?.mobile_number}
            </p>
            <p className="text-xs">
              <span className="font-bold">Address :</span> {millData?.address}
            </p>
            <p className="text-xs">
              <span className="font-bold">Item Name :</span>{" "}
              {itemData?.item_name}
            </p>
          </div>

          {/* Company Info */}
          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="font-bold">Report :</span> Mill Item-wise Ledger
            </p>
            <p className="text-xs">
              <span className="font-bold">From Date :</span>{" "}
              {dateRange?.from ? format(dateRange.from, "dd-MM-yyyy") : "-"}
            </p>
            <p className="text-xs">
              <span className="font-bold">To Date :</span>{" "}
              {dateRange?.to ? format(dateRange.to, "dd-MM-yyyy") : "-"}
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-lg border shadow">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">DC No</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Qty In</th>
                <th className="p-2 border">Wt In</th>
                <th className="p-2 border">Qty Out</th>
                <th className="p-2 border">Wt Out</th>
                <th className="p-2 border">Closing Qty</th>
                <th className="p-2 border">Closing Wt</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}

              {rows.map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{row.date}</td>
                  <td className="p-2 border">{row.dc_no}</td>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border text-right">{row.qty_in ?? "-"}</td>
                  <td className="p-2 border text-right">{row.wt_in ?? "-"}</td>
                  <td className="p-2 border text-right">
                    {row.qty_out ?? "-"}
                  </td>
                  <td className="p-2 border text-right">{row.wt_out ?? "-"}</td>
                  <td className="p-2 border text-right">{row.closing_qty}</td>
                  <td className="p-2 border text-right">
                    {row.closing_weight}
                  </td>
                </tr>
              ))}

              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
