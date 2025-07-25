import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { usePostAllDetailReportMutation } from "@/api/ReportApi";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function OverAllReport() {
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };

  const [postOverAllReport] = usePostAllDetailReportMutation();

  const form = useForm<z.infer<typeof OverAllReportSchema>>({
    resolver: zodResolver(OverAllReportSchema),
    defaultValues: {
      user_id: 1,
      from_date: new Date().toISOString().split("T")[0],
      to_date: new Date().toISOString().split("T")[0],
    },
  });

  const [InwardReportData, setInwardReportData] = React.useState<
    InwardReport[]
  >([]);
  const [totals, setTotals] = React.useState<Totals | null>(null);

  async function onSubmit(values: z.infer<typeof OverAllReportSchema>) {
    try {
      const response = await postOverAllReport(values).unwrap();
      console.log("API Response:", response);
      setInwardReportData(response.inwards);
      setTotals(response.totals);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  }

  return (
    <>
      <CommonHeader
        name="Over All Detail Report"
        trigger={
          <ExportActions
            fileName="over-all-report-detail"
            sections={[
              // Inward Data Listing (Simple flat list)
              {
                title: "Inward",
                columns: ["Customer", "Mill", "Inward No", "Date"],
                rows: InwardReportData.map((row) => [
                  row.customer?.customer_name ?? "-",
                  row.mill?.mill_name ?? "-",
                  row.inward_no,
                  row.inward_date,
                ]),
              },

              // Over-All Detail Report (Full details)
              ...InwardReportData.map((row) => ({
                title: `Inward Details`,
                columns: [
                  "S.No",
                  "Item",
                  "Yarn Type",
                  "Dia",
                  "GSM",
                  "Gauge",
                  "Qty",
                  "Weight",
                  "Date",
                ],
                rows: [
                  // 🔹 Inward details
                  ...(row.inward_details?.map((detail, detailIndex) => [
                    detailIndex + 1,
                    detail.item?.item_name ?? "-",
                    detail.yarn_type?.yarn_type ?? "-",
                    detail.yarn_dia ?? "-",
                    detail.yarn_gsm ?? "-",
                    detail.yarn_gauge ?? "-",
                    detail.inward_qty ?? "-",
                    detail.inward_weight ?? "-",
                    detail.inward_detail_date ?? "-",
                  ]) ?? []),

                  // Inward Total row
                  [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "Inward Total",
                    row.total_quantity ?? 0,
                    row.total_weight ?? 0,
                    "",
                  ],

                  // Outwards (if any)
                  ...(row.outwards?.flatMap((outward) => [
                    // Header for outward
                    ["", "", "", "", "", `Outward`, "", "", ""],
                    // Outward detail rows
                    ...(outward.outward_details?.map((detail, detailIndex) => [
                      detailIndex + 1,
                      detail.item?.item_name ?? "-",
                      detail.yarn_type?.yarn_type ?? "-",
                      detail.yarn_dia ?? "-",
                      detail.yarn_gsm ?? "-",
                      detail.yarn_gauge ?? "-",
                      detail.outward_qty ?? "-",
                      detail.outward_weight ?? "-",
                      detail.outward_detail_date ?? "-",
                    ]) ?? []),
                    // Outward Total row
                    [
                      "",
                      "",
                      "",
                      "",
                      "",
                      "Outward Total",
                      outward.total_quantity ?? 0,
                      outward.total_weight ?? 0,
                      "",
                    ],
                  ]) ?? []),

                  // Final Balance row
                  [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "Balance",
                    totals?.balance?.balance_quantity ?? 0,
                    totals?.balance?.balance_weight ?? 0,
                    "",
                  ],
                ],
              })),
            ]}
          />
        }
      />

      {/* Search Form */}
      <Card className="@container/card">
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              id="report-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name="from_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Date*</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name="to_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Date*</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <SelectPopover
                    label="Customer"
                    placeholder="Select Customer..."
                    options={customers}
                    valueKey="id"
                    labelKey="customer_name"
                    name="customer_id"
                    control={form.control}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <SelectPopover
                    label="Mill"
                    placeholder="Select Mill..."
                    options={mills}
                    valueKey="id"
                    labelKey="mill_name"
                    name="mill_id"
                    control={form.control}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name="search_data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Any Data</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter search data" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-end justify-end min-w-[150px]">
                  <Button type="submit" className="m-1">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card className="@container/card mt-1">
        <CardContent className="pt-4">
          <Table>
            <TableBody>
              {InwardReportData.map((row, index) => (
                <React.Fragment key={row.id ?? index}>
                  {/* Main Inward - Grid View */}

                  <TableRow className="font-semibold">
                    <TableCell colSpan={8}>Inward</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm ">Customer</p>
                          <p className="text-lg font-medium">
                            {row.customer?.customer_name ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm ">Mill</p>
                          <p className="text-lg font-medium">
                            {row.mill?.mill_name ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm ">Inward No</p>
                          <p className="text-lg font-medium">{row.inward_no}</p>
                        </div>
                        <div>
                          <p className="text-sm ">Date</p>
                          <p className="text-lg font-medium">
                            {row.inward_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm ">Qty</p>
                          <p className="text-lg font-medium">
                            {row.total_quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm ">Weight</p>
                          <p className="text-lg font-medium">
                            {row.total_weight}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Inward Details - Table */}
                  {Array.isArray(row.inward_details) &&
                    row.inward_details.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-0">
                          <Table className="border mt-2">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-left">
                                  S.No
                                </TableHead>
                                <TableHead className="text-left">
                                  Item
                                </TableHead>
                                <TableHead className="text-left">
                                  Yarn Type
                                </TableHead>
                                <TableHead className="text-right">
                                  Dia
                                </TableHead>
                                <TableHead className="text-right">
                                  GSM
                                </TableHead>
                                <TableHead className="text-right">
                                  Gauge
                                </TableHead>
                                <TableHead className="text-right">
                                  Qty
                                </TableHead>
                                <TableHead className="text-right">
                                  Weight
                                </TableHead>
                                <TableHead className="text-left">
                                  Date
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.inward_details.map((detail, detailIndex) => (
                                <TableRow key={detail.id ?? detailIndex}>
                                  <TableCell className="text-left">
                                    {detailIndex + 1}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {detail.item?.item_name ?? "-"}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {detail.yarn_type?.yarn_type ?? "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {detail.yarn_dia}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {detail.yarn_gsm}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {detail.yarn_gauge}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {detail.inward_qty}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {detail.inward_weight}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {detail.inward_detail_date}
                                  </TableCell>
                                </TableRow>
                              ))}

                              {/* Inward Total */}
                              <TableRow className="font-medium">
                                {/* Empty cells to match S.No → Gauge */}
                                <TableCell colSpan={6} className="text-right">
                                  Inward Total:
                                </TableCell>

                                {/* Qty */}
                                <TableCell className="text-right">
                                  {row.total_quantity}
                                </TableCell>

                                {/* Weight */}
                                <TableCell className="text-right">
                                  {row.total_weight}
                                </TableCell>

                                {/* Date (empty for total row) */}
                                <TableCell />
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}

                  {/*  Outward Details */}
                  {Array.isArray(row.outwards) &&
                    row.outwards.map((outward, outwardIndex) => (
                      <React.Fragment key={outward.id ?? outwardIndex}>
                        {/* Outward Header */}
                        <TableRow className="font-semibold">
                          <TableCell colSpan={8}>Outward</TableCell>
                        </TableRow>

                        {/* Outward Details Table */}
                        {Array.isArray(outward.outward_details) &&
                          outward.outward_details.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="p-0">
                                <Table className="border mt-2">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-left">
                                        S.No
                                      </TableHead>
                                      <TableHead className="text-left">
                                        Item
                                      </TableHead>
                                      <TableHead className="text-left">
                                        Yarn Type
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Dia
                                      </TableHead>
                                      <TableHead className="text-right">
                                        GSM
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Gauge
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Qty
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Weight
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Delivered
                                      </TableHead>
                                      <TableHead className="text-left">
                                        Date
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {outward.outward_details.map(
                                      (detail, detailIndex) => (
                                        <TableRow
                                          key={detail.id ?? detailIndex}
                                        >
                                          <TableCell className="text-left">
                                            {detailIndex + 1}
                                          </TableCell>
                                          <TableCell className="text-left">
                                            {detail.item?.item_name ?? "-"}
                                          </TableCell>
                                          <TableCell className="text-left">
                                            {detail.yarn_type?.yarn_type ?? "-"}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.yarn_dia}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.yarn_gsm}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.yarn_gauge}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.outward_qty}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.outward_weight}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {detail.deliverd_weight}
                                          </TableCell>
                                          <TableCell className="text-left">
                                            {detail.outward_detail_date}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}

                                    {/*  Outward Total */}
                                    <TableRow className="font-medium">
                                      <TableCell
                                        colSpan={6}
                                        className="text-right"
                                      >
                                        Outward Total:
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {outward.total_quantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {outward.total_weight}
                                      </TableCell>
                                    </TableRow>

                                    {/*  Final Balance */}
                                    {totals && (
                                      <TableRow className="font-bold">
                                        <TableCell
                                          colSpan={6}
                                          className="text-right"
                                        >
                                          Balance:
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {totals.balance?.balance_quantity ??
                                            0}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {totals.balance?.balance_weight ?? 0}
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableCell>
                            </TableRow>
                          )}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
