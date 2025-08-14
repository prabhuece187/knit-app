import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { usePostMillLedgerItemWiseMutation } from "@/api/ReportApi";

type MillLedger = {
  mill_name: string;
  mobile_number?: string;
  address?: string;
};

type DcWiseReport = {
  date: string;
  type: string;
  dc_no: string;
  item: string;
  qty: number;
  weight: number;
  closing_qty: number;
  closing_weight: number;
};

type PrintFormat = "A4" | "A5" | "Thermal";

type Props = {
  id: number;
};

export default function MillLedgerItemWise({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [millData, setMillData] = useState<MillLedger>();
  const [reportData, setReportData] = useState<DcWiseReport[]>([]);
  const [MillLedgerInOutItemWiseApi] = usePostMillLedgerItemWiseMutation();

  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const from = range?.from ? format(range.from, "yyyy-MM-dd") : "";
    const to = range?.to ? format(range.to, "yyyy-MM-dd") : "";

    const requestBody = { from, to, id };

    try {
      const response = await MillLedgerInOutItemWiseApi(requestBody).unwrap();
      setReportData(response.report);
      setMillData(response.mill);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <>
      {/* Form + Search */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
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
              <span className="text-xs font-bold">Mill :</span>{" "}
              {millData?.mill_name}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Mobile :</span>{" "}
              {millData?.mobile_number}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Address :</span>{" "}
              {millData?.address}
            </p>
          </div>

          {/* Company Info */}
          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Report :</span> Mill Item-wise
              Ledger
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

        {/* Table */}
        {Array.isArray(reportData) && reportData.length > 0 ? (
          <table className="w-full border border-gray-300 border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 text-left">Date</th>
                <th className="p-2 border-r border-gray-300 text-left">Type</th>
                <th className="p-2 border-r border-gray-300 text-left">
                  DC No
                </th>
                <th className="p-2 border-r border-gray-300 text-left">Item</th>
                <th className="p-2 border-r border-gray-300 text-right">Qty</th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Weight
                </th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Closing Qty
                </th>
                <th className="p-2 text-right">Closing Weight</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="p-2">
                    {row.date ? format(new Date(row.date), "dd-MM-yyyy") : "-"}
                  </td>
                  <td className="p-2">{row.type}</td>
                  <td className="p-2">{row.dc_no}</td>
                  <td className="p-2">{row.item}</td>
                  <td className="p-2 text-right">{row.qty}</td>
                  <td className="p-2 text-right">{row.weight}</td>
                  <td className="p-2 text-right">{row.closing_qty}</td>
                  <td className="p-2 text-right">{row.closing_weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-xs">
            No data found for selected range.
          </p>
        )}
      </div>
    </>
  );
}
