import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { usePostOverAllReportMutation } from "@/api/ReportApi";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import DateRangePicker from "@/components/common/DateRangePicker";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverAllReportSchema } from "@/schema-types/report-schema";

import type {
  InwardReport,
  OutwardReport,
  Totals,
} from "@/schema-types/report-schema";
import type { Customer, Mill } from "@/schema-types/master-schema";

export default function OverAllReport() {
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as {
    data: Mill[];
  };

  const [postOverAll] = usePostOverAllReportMutation();

  const form = useForm({
    resolver: zodResolver(OverAllReportSchema),
    defaultValues: {
      user_id: 1,
      from_date: new Date().toISOString().split("T")[0],
      to_date: new Date().toISOString().split("T")[0],
    },
  });

  const [range, setRange] = React.useState<DateRange | undefined>();
  const [printFormat, setPrintFormat] = React.useState<"A4" | "A5" | "Thermal">(
    "A4",
  );

  const [InwardReportData, setInwardReportData] = React.useState<
    InwardReport[]
  >([]);
  const [OutwardReportData, setOutwardReportData] = React.useState<
    OutwardReport[]
  >([]);
  const [totals, setTotals] = React.useState<Totals | null>(null);

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const requestBody = {
      user_id: 1,
      from_date: formData.get("from_date") as string,
      to_date: formData.get("to_date") as string,
      customer_id: formData.get("customer_id") as string,
      mill_id: formData.get("mill_id") as string,
      search_data: formData.get("search_data") as string,
    };

    try {
      const response = await postOverAll(requestBody).unwrap();

      setInwardReportData(response.inwards);
      setOutwardReportData(response.outwards);
      setTotals(response.totals);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const onPrint = () => window.print();

  return (
    <>
      {/* HEADER */}
      <CommonHeader
        name="Over All Report"
        trigger={
          <ExportActions
            fileName="over-all-report"
            sections={[
              {
                title: "Inward Report",
                columns: [
                  "S.No",
                  "Customer",
                  "Mill",
                  "No",
                  "Date",
                  "Qty",
                  "Wt",
                ],
                rows: InwardReportData.map((row, i) => [
                  i + 1,
                  row.customer?.customer_name ?? "-",
                  row.mill?.mill_name ?? "-",
                  row.inward_no,
                  row.inward_date,
                  row.total_quantity,
                  row.total_weight,
                ]),
              },
              {
                title: "Outward Report",
                columns: [
                  "S.No",
                  "Customer",
                  "Mill",
                  "No",
                  "Date",
                  "Qty",
                  "Wt",
                ],
                rows: OutwardReportData.map((row, i) => [
                  i + 1,
                  row.customer?.customer_name ?? "-",
                  row.mill?.mill_name ?? "-",
                  row.outward_no,
                  row.outward_date,
                  row.total_quantity,
                  row.total_weight,
                ]),
              },
            ]}
          />
        }
      />

      {/* FILTER */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 mb-4 items-end"
        >
          {/* Date */}
          <div className="min-w-[220px]">
            <input
              type="hidden"
              name="from_date"
              value={range?.from ? format(range.from, "yyyy-MM-dd") : ""}
            />
            <input
              type="hidden"
              name="to_date"
              value={range?.to ? format(range.to, "yyyy-MM-dd") : ""}
            />
            <DateRangePicker value={range} onChange={setRange} />
          </div>

          {/* Customer */}
          <div className="min-w-[200px]">
            <SelectPopover
              label="Customer"
              placeholder="Customer"
              options={customers}
              valueKey="id"
              labelKey="customer_name"
              name="customer_id"
              control={form.control}
            />
            <input
              type="hidden"
              name="customer_id"
              value={form.watch("customer_id") || ""}
            />
          </div>

          {/* Mill */}
          <div className="min-w-[200px]">
            <SelectPopover
              label="Mill"
              placeholder="Mill"
              options={mills}
              valueKey="id"
              labelKey="mill_name"
              name="mill_id"
              control={form.control}
            />
            <input
              type="hidden"
              name="mill_id"
              value={form.watch("mill_id") || ""}
            />
          </div>

          {/* Search */}
          <div className="min-w-[200px]">
            <FormField
              control={form.control}
              name="search_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">
                    Search
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any data..."
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <input
              type="hidden"
              name="search_data"
              value={form.watch("search_data") || ""}
            />
          </div>

          {/* Button */}
          <Button type="submit" size="icon" variant="outline">
            <Search className="h-4 w-4" />
          </Button>

          {/* Print */}
          <div className="flex gap-2 text-sm ml-auto">
            <select
              className="border rounded px-2 py-1"
              value={printFormat}
              onChange={(e) =>
                setPrintFormat(e.target.value as "A4" | "A5" | "Thermal")
              }
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="Thermal">Thermal</option>
            </select>

            <Button onClick={onPrint} variant="outline" size="sm">
              Print
            </Button>
          </div>
        </form>
      </Form>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-12 gap-4">
        {/* Inward */}
        <div className="col-span-12 lg:col-span-6">
          <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
            <h2 className="font-semibold mb-3 text-base">📦 Inward Report</h2>

            <table className="w-full text-sm">
              <tbody>
                {InwardReportData.map((row, i) => (
                  <tr key={i} className="border-b odd:bg-white even:bg-gray-50">
                    <td className="py-2">{i + 1}</td>
                    <td>{row.customer?.customer_name}</td>
                    <td>{row.mill?.mill_name}</td>
                    <td>{row.inward_no}</td>
                    <td>{row.inward_date}</td>
                    <td className="text-right">{row.total_quantity}</td>
                    <td className="text-right">{row.total_weight}</td>
                  </tr>
                ))}

                <tr className="font-semibold bg-gray-100">
                  <td colSpan={5} className="py-2 text-right">
                    Total
                  </td>
                  <td className="text-right">
                    {totals?.inward?.total_quantity ?? 0}
                  </td>
                  <td className="text-right">
                    {totals?.inward?.total_weight ?? 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Outward */}
        <div className="col-span-12 lg:col-span-6">
          <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
            <h2 className="font-semibold mb-3 text-base">📤 Outward Report</h2>

            <table className="w-full text-sm">
              <tbody>
                {OutwardReportData.map((row, i) => (
                  <tr key={i} className="border-b odd:bg-white even:bg-gray-50">
                    <td className="py-2">{i + 1}</td>
                    <td>{row.customer?.customer_name}</td>
                    <td>{row.mill?.mill_name}</td>
                    <td>{row.outward_no}</td>
                    <td>{row.outward_date}</td>
                    <td className="text-right">{row.total_quantity}</td>
                    <td className="text-right">{row.total_weight}</td>
                  </tr>
                ))}

                <tr className="font-semibold bg-gray-100">
                  <td colSpan={5} className="py-2 text-right">
                    Total
                  </td>
                  <td className="text-right">
                    {totals?.outward?.total_quantity ?? 0}
                  </td>
                  <td className="text-right">
                    {totals?.outward?.total_weight ?? 0}
                  </td>
                </tr>

                <tr className="font-semibold text-green-700">
                  <td colSpan={5} className="py-2 text-right">
                    Balance
                  </td>
                  <td className="text-right">
                    {totals?.balance?.balance_quantity ?? 0}
                  </td>
                  <td className="text-right">
                    {totals?.balance?.balance_weight ?? 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="col-span-12">
          <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
            <h2 className="font-semibold mb-3 text-base">📊 Summary</h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Inward Qty</p>
                <p className="font-semibold text-base">
                  {totals?.inward?.total_quantity ?? 0}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Inward Wt</p>
                <p className="font-semibold text-base">
                  {totals?.inward?.total_weight ?? 0}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Outward Qty</p>
                <p className="font-semibold text-base">
                  {totals?.outward?.total_quantity ?? 0}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Outward Wt</p>
                <p className="font-semibold text-base">
                  {totals?.outward?.total_weight ?? 0}
                </p>
              </div>

              <div className="text-green-700">
                <p className="text-gray-500">Balance Qty</p>
                <p className="font-semibold text-base">
                  {totals?.balance?.balance_quantity ?? 0}
                </p>
              </div>

              <div className="text-green-700">
                <p className="text-gray-500">Balance Wt</p>
                <p className="font-semibold text-base">
                  {totals?.balance?.balance_weight ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
