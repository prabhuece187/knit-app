import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { usePostYarnTypeLedgerMutation } from "@/api/ReportApi";

type Report = {
  date: string;
  type: string;
  in_qty: number;
  out_qty: number;
  closing_qty: number;
  in_weight: number;
  out_weight: number;
  closing_weight: number;
  inward_no?: string;
  outward_no?: string;
};

type YarnType = {
  yarn_type: string;
};

type Props = {
  id: number;
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function YarnTypeLedger({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [yarnTypeData, setYarnTypeData] = useState<YarnType>();
  const [reportData, setReportData] = useState<Report[]>([]);
  const [fetchLedger] = usePostYarnTypeLedgerMutation();
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!range?.from || !range?.to || !id) {
      console.error("Please select yarn type and date range");
      return;
    }

    try {
      const response = await fetchLedger({
        yarn_type_id: id,
        from_date: format(range.from, "yyyy-MM-dd"),
        to_date: format(range.to, "yyyy-MM-dd"),
      }).unwrap();

      setReportData(response.ledger || []);
      setYarnTypeData(response.yarn_type || undefined);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
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

        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>

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
        <div className="w-1/2 space-y-2 text-left">
          <p className="text-xs">
            <span className="font-bold">Company :</span> Coder Plays
          </p>
          <p className="text-xs">
            <span className="font-bold">Yarn Type :</span>{" "}
            {yarnTypeData?.yarn_type || "-"}
          </p>
          <p className="text-xs">
            <span className="font-bold">Report :</span> Yarn Type In/Outward
            Ledger
          </p>
          <p className="text-xs">
            <span className="font-bold">From Date :</span>{" "}
            {range?.from ? format(range.from, "dd-MM-yyyy") : "-"}
          </p>
          <p className="text-xs">
            <span className="font-bold">To Date :</span>{" "}
            {range?.to ? format(range.to, "dd-MM-yyyy") : "-"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">DC No</th>
              <th className="border p-2">In Qty</th>
              <th className="border p-2">Out Qty</th>
              <th className="border p-2">Closing Qty</th>
              <th className="border p-2">In Wt</th>
              <th className="border p-2">Out Wt</th>
              <th className="border p-2">Closing Wt</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-2">
                  {format(new Date(row.date), "dd-MM-yyyy")}
                </td>
                <td className="border p-2">{row.type}</td>
                <td className="border p-2">
                  {row.type === "Inward"
                    ? `In-${row.inward_no ?? "-"}`
                    : `Out-${row.outward_no ?? "-"}`}
                </td>
                <td className="border p-2 text-right">{row.in_qty}</td>
                <td className="border p-2 text-right">{row.out_qty}</td>
                <td className="border p-2 text-right">{row.closing_qty}</td>
                <td className="border p-2 text-right">{row.in_weight}</td>
                <td className="border p-2 text-right">{row.out_weight}</td>
                <td className="border p-2 text-right">{row.closing_weight}</td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center border p-4 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
