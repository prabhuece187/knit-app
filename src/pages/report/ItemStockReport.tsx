import { usePostItemStockReportMutation } from "@/api/ReportApi";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type StockRow = {
  date: string;
  type: string;
  qty: number;
  weight: number;
  closing_qty: number;
  closing_weight: number;
};

type ItemDetail = {
  id: number;
  item_name: string;
  item_code: string;
  unit: string;
  description: string;
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function ItemStockReport({ id }: { id: number }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [itemDetail, setItemDetail] = useState<ItemDetail>();
  const [reportData, setReportData] = useState<StockRow[]>([]);
  const [fetchStockReport] = usePostItemStockReportMutation();
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    try {
      const res = await fetchStockReport({ from, to, id }).unwrap();
      setItemDetail(res.item);
      setReportData(res.stock_report);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
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

        <DateRangePicker value={range} onChange={setRange} />
        <Button type="submit" size="icon" variant="outline">
          <Search className="h-4 w-4" />
        </Button>

        {/* Print format selector and print button */}
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

      <div
        id="printable-area"
        className={`print-container print-${printFormat.toLowerCase()}`}
      >
        <div className="flex justify-between mb-6">
          {/* Item Info */}
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="text-xs font-bold">Item Name & Code :</span>{" "}
              {itemDetail?.item_name} ({itemDetail?.item_code})
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Unit :</span>{" "}
              {itemDetail?.unit}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Descriptiion :</span>{" "}
              {itemDetail?.description}
            </p>
          </div>
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Reports :</span> Individual
              Item Stock
            </p>
          </div>
        </div>

        {reportData.length > 0 ? (
          <table className="w-full border text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Weight</th>
                <th className="p-2 border">Closing Qty</th>
                <th className="p-2 border">Closing Wt</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">
                    {format(new Date(row.date), "dd-MM-yyyy")}
                  </td>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border text-right">{row.qty}</td>
                  <td className="p-2 border text-right">{row.weight}</td>
                  <td className="p-2 border text-right">{row.closing_qty}</td>
                  <td className="p-2 border text-right">
                    {row.closing_weight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-xs">No data found.</p>
        )}
      </div>
    </>
  );
}
