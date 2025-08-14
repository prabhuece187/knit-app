import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { usePostMillLedgerInOutMutation } from "@/api/ReportApi";
import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

type BaseLedger = {
  date: string;
  type: string;
  description: string;
};

type NormalLedger = BaseLedger & {
  type: "Inward" | "Outward";
  qty: number;
  weight: number;
};

type LossLedger = BaseLedger & {
  type: "Loss";
  qty_loss: number;
  weight_loss: number;
};

type TotalLedger = {
  type: "Total";
  qty_inward: number;
  weight_inward: number;
  qty_outward: number;
  weight_outward: number;
};

type MillLedgerData = {
  mill_name: string;
  mill_mobile: string;
  mill_address: string;
};

type LedgerEntry = NormalLedger | LossLedger | TotalLedger;

type PrintFormat = "A4" | "A5" | "Thermal";

type Props = {
  id: number; // mill id
};

export default function MillLedgerReport({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [millData, setMillData] = useState<MillLedgerData>();
  const [postMillLedgerInOut] = usePostMillLedgerInOutMutation();

  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    try {
      const response = await postMillLedgerInOut({ from, to, id }).unwrap();
      setLedgerData(response.ledger);
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
        {/* Header Info */}
        <div className="flex justify-between mb-6">
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="text-xs font-bold">Mill :</span>{" "}
              {millData?.mill_name}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Mobile :</span>{" "}
              {millData?.mill_mobile}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Address :</span>{" "}
              {millData?.mill_address}
            </p>
          </div>

          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Report :</span> Mill
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

        {/* Ledger Table */}
        {ledgerData.length > 0 ? (
          <table className="w-full border border-gray-300 border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-2 text-left border-r border-gray-300">Type</th>
                <th className="p-2 text-left border-r border-gray-300">Date</th>
                <th className="p-2 text-left border-r border-gray-300">
                  Description
                </th>
                <th className="p-2 text-right border-r border-gray-300">Qty</th>
                <th className="p-2 text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.map((row, idx) => {
                if (row.type === "Total") {
                  return (
                    <tr
                      key={idx}
                      className="font-semibold border-t border-gray-300"
                    >
                      <td colSpan={3} className="p-2">
                        Total
                      </td>
                      <td className="p-2 text-right">{`Inward = ${row.qty_inward} / Outward = ${row.qty_outward}`}</td>
                      <td className="p-2 text-right">{`Inward = ${row.weight_inward} / Outward = ${row.weight_outward}`}</td>
                    </tr>
                  );
                }
                if (row.type === "Loss") {
                  return (
                    <tr key={idx} className="text-red-600 font-semibold">
                      <td colSpan={3} className="p-2">
                        {row.type}
                      </td>
                      <td className="p-2 text-right">{row.qty_loss}</td>
                      <td className="p-2 text-right">{row.weight_loss}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="p-2">{row.type}</td>
                    <td className="p-2">
                      {row.date
                        ? format(new Date(row.date), "dd-MM-yyyy")
                        : "-"}
                    </td>
                    <td className="p-2">{row.description}</td>
                    <td className="p-2 text-right">{row.qty}</td>
                    <td className="p-2 text-right">{row.weight}</td>
                  </tr>
                );
              })}
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
