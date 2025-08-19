import { usePostItemStockReportCustomerWiseMutation } from "@/api/ReportApi";
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
  customer_name: string;
  inward_no: string;
  outward_no: string;
};

type CustomerStockReport = {
  customer_id: number;
  customer_name: string;
  closing_qty: number;
  closing_weight: number;
  transactions: StockRow[];
};

type ItemDetail = {
  id: number;
  item_name: string;
  item_code: string;
  unit: string;
  description: string;
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function ItemStockCustomerWise({ id }: { id: number }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [itemDetail, setItemDetail] = useState<ItemDetail>();
  const [customerReports, setCustomerReports] = useState<CustomerStockReport[]>(
    []
  );
  const [fetchStockReport] = usePostItemStockReportCustomerWiseMutation();
  const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    try {
      const res = await fetchStockReport({ from, to, id }).unwrap();
      setItemDetail(res.item);
      setCustomerReports(res.customerReports);
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
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        {/* Header Section */}
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

          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Report :</span> Individual
              Item Stock Customer Wise
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
        {/* Customer-wise Reports */}
        {!customerReports || customerReports.length === 0 ? (
          <p className="text-gray-500 text-xs">No data found.</p>
        ) : (
          customerReports.map((custReport) => (
            <table
              className="w-full border border-collapse"
              style={{ borderColor: "#444", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "left" }}
                  >
                    Date
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "left" }}
                  >
                    Customer
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "left" }}
                  >
                    Type
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "left" }}
                  >
                    DC No
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "right" }}
                  >
                    Qty
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "right" }}
                  >
                    Weight
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "right" }}
                  >
                    Closing Qty
                  </th>
                  <th
                    className="p-2 border"
                    style={{ borderColor: "#444", textAlign: "right" }}
                  >
                    Closing Wt
                  </th>
                </tr>
              </thead>
              <tbody>
                {custReport.transactions.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                    <td className="p-2 border" style={{ borderColor: "#444" }}>
                      {format(new Date(row.date), "dd-MM-yyyy")}
                    </td>
                    <td className="p-2 border" style={{ borderColor: "#444" }}>
                      {row.customer_name}
                    </td>
                    <td className="p-2 border" style={{ borderColor: "#444" }}>
                      {row.type}
                    </td>
                    <td className="p-2 border" style={{ borderColor: "#444" }}>
                      {row.type === "Inward"
                        ? `In-${row.inward_no ?? "-"}`
                        : `Out-${row.outward_no ?? "-"}`}
                    </td>
                    <td
                      className="p-2 border text-right"
                      style={{ borderColor: "#444", textAlign: "right" }}
                    >
                      {row.qty}
                    </td>
                    <td
                      className="p-2 border text-right"
                      style={{ borderColor: "#444", textAlign: "right" }}
                    >
                      {row.weight}
                    </td>
                    <td
                      className="p-2 border text-right"
                      style={{ borderColor: "#444", textAlign: "right" }}
                    >
                      {row.closing_qty}
                    </td>
                    <td
                      className="p-2 border text-right"
                      style={{ borderColor: "#444", textAlign: "right" }}
                    >
                      {row.closing_weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))
        )}
      </div>
    </>
  );
}
