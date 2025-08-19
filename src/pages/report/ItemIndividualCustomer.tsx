import { useState } from "react";
import DateRangePicker from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { usePostItemIndividualCustomerMutation } from "@/api/ReportApi";
import type { Customer } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";

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

type ItemDetail = {
  id: number;
  item_name: string;
  item_code: string;
  unit: string;
  description: string;
};

type CustomerDetail = {
  id: number;
  customer_name: string;
  mobile_number: string;
};

type PrintFormat = "A4" | "A5" | "Thermal";

export default function ItemStockSingleCustomer({ id }: { id: number }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [transactions, setTransactions] = useState<StockRow[]>([]);
  const [itemDetail, setItemDetail] = useState<ItemDetail>();
  const [customerDetail, setCustomer] = useState<CustomerDetail>();
  const [fetchStockReport] = usePostItemIndividualCustomerMutation();
    const [printFormat, setPrintFormat] = useState<PrintFormat>("A4");
    
    const { data: customers = [] } = useGetCustomerListQuery("") as {
        data: Customer[];
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      alert("Please select customer");
      return;
    }

    try {
      const res = await fetchStockReport({
        from: range?.from ? format(range.from, "yyyy-MM-dd") : "",
        to: range?.to ? format(range.to, "yyyy-MM-dd") : "",
        id,
        customer_id: customerId,
      }).unwrap();

      setItemDetail(res.item);
      setCustomer(res.customer);
      setTransactions(res.transactions);
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
        <DateRangePicker value={range} onChange={setRange} />

        <select
          className="border rounded p-1 text-xs"
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value) || undefined)}
          aria-label="Item"
        >
          <option value="">All Customer</option>
          {customers.map((it) => (
            <option key={it.id} value={it.id}>
              {it.customer_name}
            </option>
          ))}
        </select>

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
              <span className="text-xs font-bold">Customer :</span>{" "}
              {customerDetail?.customer_name}
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Mobile :</span>{" "}
              {customerDetail?.mobile_number}
            </p>
          </div>

          <div className="w-1/2 space-y-2 text-right">
            <p className="text-xs">
              <span className="text-xs font-bold">Company :</span> Coder Plays
            </p>
            <p className="text-xs">
              <span className="text-xs font-bold">Report :</span> Individual
              Item Stock Individual Customer
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

        {transactions.length === 0 ? (
          <p className="text-xs text-gray-500">No data found.</p>
        ) : (
          <table className="w-full border border-collapse text-xs">
            <thead>
              <tr>
                <th className="border p-1">Date</th>
                <th className="border p-1">Type</th>
                <th className="border p-1">DC No</th>
                <th className="border p-1 text-right">Qty</th>
                <th className="border p-1 text-right">Weight</th>
                <th className="border p-1 text-right">Closing Qty</th>
                <th className="border p-1 text-right">Closing Wt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((row, i) => (
                <tr key={i}>
                  <td className="border p-1">
                    {format(new Date(row.date), "dd-MM-yyyy")}
                  </td>
                  <td className="border p-1">{row.type}</td>
                  <td className="border p-1">
                    {row.type === "Inward"
                      ? `In-${row.inward_no ?? "-"}`
                      : `Out-${row.outward_no ?? "-"}`}
                  </td>
                  <td className="border p-1 text-right">{row.qty}</td>
                  <td className="border p-1 text-right">{row.weight}</td>
                  <td className="border p-1 text-right">{row.closing_qty}</td>
                  <td className="border p-1 text-right">
                    {row.closing_weight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
