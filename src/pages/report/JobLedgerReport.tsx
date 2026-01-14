import React from "react";
import { usePostJobLedgerReportMutation } from "@/api/ReportApi";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import type { JobMaster } from "@/schema-types/master-schema";

export default function JobLedgerReport() {
  const [jobCardId, setJobCardId] = React.useState<number | null>(null);

  const { data: jobCards = [] } = useGetJobListQuery("") as {
      data: JobMaster[];
    };

  const [postJobLedgerReport, { data, isLoading }] =
    usePostJobLedgerReportMutation();

  const handleSearch = () => {
    if (!jobCardId) return;
    postJobLedgerReport({ job_card_id: jobCardId });
  };

  return (
    <>
      <CommonHeader
        name="Job Ledger Report"
        trigger={
          data && (
            <ExportActions
              fileName="job-ledger-report"
              sections={[
                {
                  title: "Job Ledger",
                  columns: ["Description", "Weight (Kg)"],
                  rows: [
                    ["Yarn Issued", data.yarn_issued_kg],
                    ["Fabric Produced", data.fabric_produced_kg],
                    ["Fabric Returned", data.fabric_returned_kg],
                    ["Fabric Reworked", data.fabric_reworked_kg],
                    ["Fabric Outward", data.fabric_outward_kg],
                    ["WIP Balance", data.wip_balance_kg],
                    ["Wastage", data.wastage_kg],
                  ],
                },
              ]}
            />
          )
        }
      />

      {/* Filter */}
      <Card>
        <CardContent className="pt-4 flex gap-4">
          <SelectPopover
            placeholder="Select Job Card..."
            label=""
            options={jobCards}
            valueKey="id"
            labelKey="job_card_no"
            value={jobCardId ?? undefined}
            onValueChange={(val) => setJobCardId(Number(val))}
          />
          <Button onClick={handleSearch} disabled={!jobCardId || isLoading}>
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {data && (
        <Card className="mt-2">
          <CardContent>
            <Table>
              <TableBody>
                {(
                  [
                    ["Yarn Issued", data.yarn_issued_kg],
                    ["Fabric Produced", data.fabric_produced_kg],
                    ["Fabric Returned", data.fabric_returned_kg],
                    ["Fabric Reworked", data.fabric_reworked_kg],
                    ["Fabric Outward", data.fabric_outward_kg],
                    ["WIP Balance", data.wip_balance_kg],
                    ["Wastage", data.wastage_kg],
                  ] as [string, number][]
                ).map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell className="font-medium">{label}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
