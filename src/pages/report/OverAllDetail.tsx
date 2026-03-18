import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { usePostAllDetailReportMutation } from "@/api/ReportApi";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import { SelectPopover } from "@/components/custom/CustomPopover";
import DateRangePicker from "@/components/common/DateRangePicker";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import type { Customer, Mill } from "@/schema-types/master-schema";
import {
  OverAllReportSchema,
  type InwardReport,
  type Totals,
} from "@/schema-types/report-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function OverAllDetailReport() {
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as {
    data: Mill[];
  };

  const [postReport] = usePostAllDetailReportMutation();

  const form = useForm<z.infer<typeof OverAllReportSchema>>({
    resolver: zodResolver(OverAllReportSchema),
    defaultValues: {
      user_id: 1,
      from_date: "",
      to_date: "",
    },
  });

  const [range, setRange] = React.useState<DateRange | undefined>();
  const [data, setData] = React.useState<InwardReport[]>([]);
  const [totals, setTotals] = React.useState<Totals | null>(null);

  const [printFormat, setPrintFormat] = React.useState<"A4" | "A5" | "Thermal">(
    "A4",
  );

  // Sync Date
  React.useEffect(() => {
    if (range?.from) {
      form.setValue("from_date", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      form.setValue("to_date", format(range.to, "yyyy-MM-dd"));
    }
  }, [range, form]);

  async function onSubmit(values: z.infer<typeof OverAllReportSchema>) {
    try {
      const res = await postReport(values).unwrap();

      const safe = (res.inwards ?? []).map((row: InwardReport) => ({
        ...row,
        inward_details: row.inward_details ?? [],
        outwards: (row.outwards ?? []).map((o) => ({
          ...o,
          outward_details: o.outward_details ?? [],
        })),
      }));

      setData(safe);
      setTotals(res.totals ?? null);
    } catch (e) {
      console.error(e);
    }
  }

  const onPrint = () => window.print();

  return (
    <>
      {/* HEADER */}
      <CommonHeader
        name="Over All Detail Report"
        trigger={<ExportActions fileName="overall-report" sections={[]} />}
      />

      {/* FILTER */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap gap-4 items-end mb-4"
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
          <SelectPopover
            label="Customer"
            placeholder="Select Customer"
            options={customers}
            valueKey="id"
            labelKey="customer_name"
            name="customer_id"
            control={form.control}
          />

          {/* Mill */}
          <SelectPopover
            label="Mill"
            placeholder="Select Mill"
            options={mills}
            valueKey="id"
            labelKey="mill_name"
            name="mill_id"
            control={form.control}
          />

          {/* Search */}
          <Input
            placeholder="Search..."
            {...form.register("search_data")}
            className="w-[200px]"
          />

          <Button type="submit">Search</Button>

          {/* Print */}
          <div className="ml-auto flex gap-2">
            <select
              className="border px-2 py-1 rounded"
              value={printFormat}
              onChange={(e) =>
                setPrintFormat(e.target.value as "A4" | "A5" | "Thermal")
              }
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="Thermal">Thermal</option>
            </select>

            <Button onClick={onPrint} variant="outline">
              Print
            </Button>
          </div>
        </form>
      </Form>

      {/* REPORT (NO CARD, FULL WIDTH) */}
      {/* REPORT */}
      <div id="print-section" className="mt-4 overflow-x-auto">
        <Table className="border">
          <TableBody>
            {(data ?? []).map((row, index) => (
              <React.Fragment key={row.id ?? index}>
                {/* HEADER INFO */}
                <TableRow className="bg-gray-200">
                  <TableCell colSpan={7} className="font-semibold">
                    Customer: {row.customer?.customer_name ?? "-"} | Mill:{" "}
                    {row.mill?.mill_name ?? "-"} | Inward No: {row.inward_no} |
                    Date: {row.inward_date}
                  </TableCell>
                </TableRow>

                {/* TABLE HEADER */}
                <TableRow className="bg-gray-100 font-semibold text-center">
                  <TableCell>S.No</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell className="text-left">Item</TableCell>
                  <TableCell>Yarn</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Weight</TableCell>
                </TableRow>

                {/* INWARD ROWS */}
                {(row.inward_details ?? []).map((d, i) => (
                  <TableRow key={`in-${i}`} className="text-center">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      Inward
                    </TableCell>
                    <TableCell className="text-left">
                      {d.item?.item_name ?? "-"}
                    </TableCell>
                    <TableCell>{d.yarn_type?.yarn_type ?? "-"}</TableCell>
                    <TableCell>{d.inward_qty ?? 0}</TableCell>
                    <TableCell>{d.inward_weight ?? 0}</TableCell>
                  </TableRow>
                ))}

                {/* OUTWARD ROWS */}
                {(row.outwards ?? []).flatMap((o) =>
                  (o.outward_details ?? []).map((d, i) => (
                    <TableRow key={`out-${i}`} className="text-center">
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="text-red-600 font-medium">
                        Outward
                      </TableCell>
                      <TableCell className="text-left">
                        {d.item?.item_name ?? "-"}
                      </TableCell>
                      <TableCell>{d.yarn_type?.yarn_type ?? "-"}</TableCell>
                      <TableCell>{d.outward_qty ?? 0}</TableCell>
                      <TableCell>{d.outward_weight ?? 0}</TableCell>
                    </TableRow>
                  )),
                )}

                {/* BALANCE */}
                <TableRow className="bg-gray-300 font-bold text-center">
                  <TableCell colSpan={4}>Balance</TableCell>
                  <TableCell>
                    {totals?.balance?.balance_quantity ?? 0}
                  </TableCell>
                  <TableCell>{totals?.balance?.balance_weight ?? 0}</TableCell>
                </TableRow>

                {/* GAP */}
                <TableRow>
                  <TableCell colSpan={7} className="py-2"></TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PRINT CSS */}
      <style>
        {`
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        `}
      </style>
    </>
  );
}
