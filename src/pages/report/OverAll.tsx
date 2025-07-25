import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { usePostOverAllReportMutation } from "@/api/ReportApi";
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
  type OutwardReport,
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

  const [postOverAll] = usePostOverAllReportMutation();

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
  const [OutwardReportData, setOutwardReportData] = React.useState<
    OutwardReport[]
  >([]);
  const [totals, setTotals] = React.useState<Totals | null>(null);

  async function onSubmit(values: z.infer<typeof OverAllReportSchema>) {
    try {
      const response = await postOverAll(values).unwrap();
      console.log("API Response:", response);

      setInwardReportData(response.inwards);
      setOutwardReportData(response.outwards);
      setTotals(response.totals);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  }

  return (
    <>
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
                  "Inward No",
                  "Date",
                  "Qty",
                  "Weight",
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
                  "Outward No",
                  "Date",
                  "Qty",
                  "Weight",
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
              {
                title: "Totals & Balance",
                columns: ["Label", "Value"],
                rows: [
                  ["Total Inward Qty", totals?.inward?.total_quantity ?? 0],
                  ["Total Inward Weight", totals?.inward?.total_weight ?? 0],
                  ["Total Outward Qty", totals?.outward?.total_quantity ?? 0],
                  ["Total Outward Weight", totals?.outward?.total_weight ?? 0],
                  ["Balance Qty", totals?.balance?.balance_quantity ?? 0],
                  ["Balance Weight", totals?.balance?.balance_weight ?? 0],
                ],
              },
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
                {/* From Date */}
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

                {/* To Date */}
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

                {/* Customer */}
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

                {/* Mill */}
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

                {/* Search Data */}
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

                {/* Search Button */}
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
          <div className="grid grid-cols-12 gap-4">
            {/* Inward Table */}
            <div className="col-span-12 lg:col-span-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mill</TableHead>
                    <TableHead>Inward No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Inward Qty</TableHead>
                    <TableHead>Inward Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {InwardReportData.map((row, index) => (
                    <TableRow key={row.id ?? index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.customer?.customer_name}</TableCell>
                      <TableCell>{row.mill?.mill_name}</TableCell>
                      <TableCell>{row.inward_no}</TableCell>
                      <TableCell>{row.inward_date}</TableCell>
                      <TableCell>{row.total_quantity}</TableCell>
                      <TableCell>{row.total_weight}</TableCell>
                    </TableRow>
                  ))}
                  {totals && (
                    <TableRow className="font-bold">
                      <TableCell colSpan={5}>Total</TableCell>
                      <TableCell>
                        {totals?.inward?.total_quantity ?? 0}
                      </TableCell>
                      <TableCell>{totals?.inward?.total_weight ?? 0}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Outward Table */}
            <div className="col-span-12 lg:col-span-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mill</TableHead>
                    <TableHead>Outward No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Outward Qty</TableHead>
                    <TableHead>Outward Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {OutwardReportData.map((row, index) => (
                    <TableRow key={row.id ?? index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.customer?.customer_name}</TableCell>
                      <TableCell>{row.mill?.mill_name}</TableCell>
                      <TableCell>{row.outward_no}</TableCell>
                      <TableCell>{row.outward_date}</TableCell>
                      <TableCell>{row.total_quantity}</TableCell>
                      <TableCell>{row.total_weight}</TableCell>
                    </TableRow>
                  ))}
                  {totals && (
                    <>
                      <TableRow className="font-bold">
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell>
                          {totals?.outward?.total_quantity ?? 0}
                        </TableCell>
                        <TableCell>
                          {totals?.outward?.total_weight ?? 0}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-bold text-green-700">
                        <TableCell colSpan={5}>Balance</TableCell>
                        <TableCell>
                          {totals?.balance?.balance_quantity ?? 0}
                        </TableCell>
                        <TableCell>
                          {totals?.balance?.balance_weight ?? 0}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
