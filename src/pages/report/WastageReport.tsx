import React from "react";
import { usePostWastageReportMutation } from "@/api/ReportApi";
import type { WastageRow } from "@/schema-types/report-schema";
import CommonHeader from "@/components/common/CommonHeader";
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

  React.useEffect(() => {
    postWastageReport(undefined);
  }, []);

  return (
    <>
      <CommonHeader name="Wastage Report" />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Card</TableHead>
                <TableHead className="text-right">Produced</TableHead>
                <TableHead className="text-right">Outward</TableHead>
                <TableHead className="text-right">Reworked</TableHead>
                <TableHead className="text-right">Wastage</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row: WastageRow) => (
                <TableRow key={row.job_card_id}>
                  <TableCell>{row.job_card_id}</TableCell>
                  <TableCell className="text-right">{row.produced}</TableCell>
                  <TableCell className="text-right">{row.outward}</TableCell>
                  <TableCell className="text-right">{row.reworked}</TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {row.wastage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground mt-2">
              Loading...
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
