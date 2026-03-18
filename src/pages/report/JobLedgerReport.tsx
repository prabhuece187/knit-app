import React from "react";
import { usePostJobLedgerReportMutation } from "@/api/ReportApi";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import CommonHeader from "@/components/common/CommonHeader";
import ExportActions from "@/components/common/ExportAction";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { Button } from "@/components/ui/button";
import type { JobMaster } from "@/schema-types/master-schema";

export default function JobLedgerReport() {
  const [jobCardId, setJobCardId] = React.useState<number | null>(null);
  const [printFormat, setPrintFormat] = React.useState<"A4" | "A5" | "Thermal">(
    "A4",
  );

  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const [postJobLedgerReport, { data, isLoading }] =
    usePostJobLedgerReportMutation();

  const handleSearch = () => {
    if (!jobCardId) return;
    postJobLedgerReport({ job_card_id: jobCardId });
  };

  const onPrint = () => window.print();

  const reportData = data
    ? [
        ["Yarn Issued", data.yarn_issued_kg],
        ["Fabric Produced", data.fabric_produced_kg],
        ["Fabric Returned", data.fabric_returned_kg],
        ["Fabric Reworked", data.fabric_reworked_kg],
        ["Fabric Outward", data.fabric_outward_kg],
        ["WIP Balance", data.wip_balance_kg],
        ["Wastage", data.wastage_kg],
      ]
    : [];

  return (
    <>
      {/* HEADER */}
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
                  rows: reportData,
                },
              ]}
            />
          )
        }
      />

      {/* FILTER */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div className="min-w-[220px]">
          <SelectPopover
            label="Job Card"
            placeholder="Select Job Card"
            options={jobCards}
            valueKey="id"
            labelKey="job_card_no"
            value={jobCardId ?? undefined}
            onValueChange={(val) => setJobCardId(Number(val))}
          />
        </div>

        <Button onClick={handleSearch} disabled={!jobCardId || isLoading}>
          {isLoading ? "Loading..." : "Search"}
        </Button>

        {/* PRINT */}
        <div className="flex gap-2 ml-auto">
          <select
            className="border rounded px-2 py-1 text-sm"
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
      </div>

      {/* REPORT TABLE */}
      {data && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-right">Weight (Kg)</th>
              </tr>
            </thead>

            <tbody>
              {reportData.map(([label, value], i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border px-3 py-2 text-left">{label}</td>
                  <td className="border px-3 py-2 text-right font-medium">
                    {value}
                  </td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr className="bg-gray-200 font-semibold">
                <td className="border px-3 py-2 text-right">Total</td>
                <td className="border px-3 py-2 text-right">
                  {reportData.reduce(
                    (sum, [, val]) =>
                      sum +
                      (typeof val === "number" ? val : parseFloat(val) || 0),
                    0,
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* SUMMARY BELOW TABLE */}
          <div className="mt-4 text-sm">
            <table className="w-full border">
              <tbody>
                <tr>
                  <td className="border px-3 py-2 text-left">WIP Balance</td>
                  <td className="border px-3 py-2 text-right text-yellow-600 font-semibold">
                    {data.wip_balance_kg}
                  </td>
                </tr>

                <tr>
                  <td className="border px-3 py-2 text-left">Wastage</td>
                  <td className="border px-3 py-2 text-right text-red-600 font-semibold">
                    {data.wastage_kg}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
