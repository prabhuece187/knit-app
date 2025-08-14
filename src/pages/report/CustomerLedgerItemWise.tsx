import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { usePostCustomerInOutItemWiseMutation } from "@/api/ReportApi";
import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

type CustomerLedger = {
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  customer_address: string;
};

type ItemWiseReport = {
  item: string;
  inward_qty: number;
  inward_weight: number;
  outward_qty: number;
  outward_weight: number;
  loss_qty: number;
  loss_weight: number;
};

type PrintFormat = "A4" | "A5" | "Thermal";

type Props = {
  id: number;
};

export default function CustomerLedgerItemWise({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [customerData, setCustomerData] = useState<CustomerLedger>();
  const [reportData, setReportData] = useState<ItemWiseReport[]>([]);
  const [CustomerLedgerInOutItemWise] = usePostCustomerInOutItemWiseMutation();

  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    const requestBody = { from, to, id };

    try {
      const response = await CustomerLedgerInOutItemWise(requestBody).unwrap();
      setReportData(response.item_wise_report);
      setCustomerData(response.customer);
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
        {/* Hidden inputs for from/to dates and ID */}
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

        {/* Date range picker */}
        <DateRangePicker value={range} onChange={setRange} />

        {/* Submit button with search icon */}
        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="shrink-0"
        >
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

      {/* Report container */}
      <div
        id="printable-area"
        className={`print-container print-${printFormat.toLowerCase()}`}
      >
        {/* Header */}
        {/* Header Info */}
        <div className="flex justify-between mb-6">
          {/* Customer Info */}
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="text-xs font-bold">Customer :</span>{" "}
              {customerData?.customer_name}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Mobile :</span>{" "}
              {customerData?.customer_mobile}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Email :</span>{" "}
              {customerData?.customer_email}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Address :</span>{" "}
              {customerData?.customer_address}
            </p>
          </div>

          {/* Company Info */}
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

        {/* Table */}
        {Array.isArray(reportData) && reportData.length > 0 ? (
          <table className="w-full border border-gray-300 border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 text-left">Item</th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Inward Qty
                </th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Inward Wt
                </th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Outward Qty
                </th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Outward Wt
                </th>
                <th className="p-2 border-r border-gray-300 text-right">
                  Loss Qty
                </th>
                <th className="p-2 text-right">Loss Wt</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="p-2">{row.item}</td>
                  <td className="p-2 text-right">{row.inward_qty}</td>
                  <td className="p-2 text-right">{row.inward_weight}</td>
                  <td className="p-2 text-right">{row.outward_qty}</td>
                  <td className="p-2 text-right">{row.outward_weight}</td>
                  <td className="p-2 text-right text-red-600">
                    {row.loss_qty}
                  </td>
                  <td className="p-2 text-right text-red-600">
                    {row.loss_weight}
                  </td>
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
