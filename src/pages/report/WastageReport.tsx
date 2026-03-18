import React from "react";
import { usePostWastageReportMutation } from "@/api/ReportApi";
import type { WastageRow } from "@/schema-types/report-schema";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WastageReport() {
  const [postWastageReport, { data = [], isLoading }] =
    usePostWastageReportMutation();

  const [printFormat, setPrintFormat] = React.useState<"A4" | "A5" | "Thermal">(
    "A4",
  );

  React.useEffect(() => {
    postWastageReport(undefined);
  }, []);

  const onPrint = () => window.print();

  // Optional: Calculate totals
  const totals = data.reduce(
    (acc, row) => ({
      produced: acc.produced + row.produced,
      outward: acc.outward + row.outward,
      reworked: acc.reworked + row.reworked,
      wastage: acc.wastage + row.wastage,
    }),
    { produced: 0, outward: 0, reworked: 0, wastage: 0 },
  );

  return (
    <>
      {/* HEADER + Export */}
      <CommonHeader
        name="Wastage Report"
        trigger={
          <ExportActions
            fileName="wastage-report"
            sections={[
              {
                title: "Wastage Report",
                columns: [
                  "S.No",
                  "Job Card",
                  "Produced",
                  "Outward",
                  "Reworked",
                  "Wastage",
                ],
                rows: data.map((row: WastageRow, i) => [
                  i + 1,
                  row.job_card_id,
                  row.produced,
                  row.outward,
                  row.reworked,
                  row.wastage,
                ]),
              },
            ]}
          />
        }
      />

      {/* Print Format Selector */}
      <div className="flex gap-2 justify-end mt-2 mb-2">
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

        <button
          onClick={onPrint}
          className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
        >
          Print
        </button>
      </div>

      {/* REPORT CARD */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <Card className="shadow-lg border border-gray-200">
            <CardContent>
              <div className="overflow-x-auto">
                <Table id="wastage-report-table" className="min-w-[600px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-left font-medium text-gray-700">
                        Job Card
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Produced
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Outward
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Reworked
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Wastage
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.length > 0 ? (
                      data.map((row: WastageRow) => (
                        <TableRow
                          key={row.job_card_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-800">
                            {row.job_card_id}
                          </TableCell>
                          <TableCell className="text-right text-gray-700">
                            {row.produced}
                          </TableCell>
                          <TableCell className="text-right text-gray-700">
                            {row.outward}
                          </TableCell>
                          <TableCell className="text-right text-gray-700">
                            {row.reworked}
                          </TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            {row.wastage}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Totals Row */}
                    {data.length > 0 && (
                      <TableRow className="font-semibold bg-gray-100">
                        <TableCell className="text-right">Total</TableCell>
                        <TableCell className="text-right">
                          {totals.produced}
                        </TableCell>
                        <TableCell className="text-right">
                          {totals.outward}
                        </TableCell>
                        <TableCell className="text-right">
                          {totals.reworked}
                        </TableCell>
                        <TableCell className="text-right">
                          {totals.wastage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {isLoading && (
                <div className="text-center text-sm text-gray-500 mt-3 animate-pulse">
                  Loading...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
