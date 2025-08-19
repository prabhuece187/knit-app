import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { usePostYarnTypeIndividualCustomerMutation } from "@/api/ReportApi";
import { useGetCustomerListQuery } from "@/api/CustomerApi";

type Report = {
  date: string;
  type: string;
  qty_in: number;
  qty_out: number;
  closing_qty: number;
  wt_in: number;
  wt_out: number;
  closing_weight: number;
  dc_no?: string;
  outward_no?: string;
};

type YarnType = {
  yarn_type: string;
};

type Customer = {
  id: number;
  customer_name: string;
};

type Props = {
  id: number;
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function YarnTypeIndividualCustomer({ id }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [yarnTypeData, setYarnTypeData] = useState<YarnType>();
  const [CustomerData, setCustomerData] = useState<Customer>();
  const [reportData, setReportData] = useState<Report[]>([]);
  const [fetchLedger] = usePostYarnTypeIndividualCustomerMutation();
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!range?.from || !range?.to || !id || !customerId) {
      console.error("Please select yarn type, customer, and date range");
      return;
    }

    try {
      const response = await fetchLedger({
        yarn_type_id: id,
        customer_id: customerId,
        from_date: format(range.from, "yyyy-MM-dd"),
        to_date: format(range.to, "yyyy-MM-dd"),
      }).unwrap();

      setReportData(response.ledger || []);
      setYarnTypeData(response.yarn_type || undefined);
      setCustomerData(response.customer || undefined);
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
        <DateRangePicker value={range} onChange={setRange} />

        <select
          value={customerId ?? ""}
          onChange={(e) => setCustomerId(Number(e.target.value) || undefined)}
          className="border rounded p-2 text-sm"
        >
          <option value="">Select Customer...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.customer_name}
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
          <div className="w-1/2 space-y-2 text-left">
            <p className="text-xs">
              <span className="font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="font-bold">Yarn Type :</span>{" "}
              {yarnTypeData?.yarn_type || "-"}
            </p>
            <p className="text-xs">
              <span className="font-bold">Customer Name :</span>{" "}
              {CustomerData?.customer_name || "-"}
            </p>
          </div>

          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="font-bold">Report :</span> Yarn Type Individual
              Customerwise
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
                  <td colSpan={10} className="text-center p-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
