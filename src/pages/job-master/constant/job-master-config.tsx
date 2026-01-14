import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { jobMasterSchema, type JobMaster } from "@/schema-types/master-schema";
import { Link } from "react-router-dom";

export function getJobMasterColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<JobMaster>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },

    {
      accessorKey: "job_card_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job No" />
      ),
      cell: ({ row }) => {
        const id = row.original.job_card_no;
        const encodedId = btoa(id.toString());
        return (
          <Link
            to={`/jobs/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.job_card_no}
          </Link>
        );
      },
    },

    {
      accessorKey: "inward.inward_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inward No" />
      ),
    },

    // ✅ FIXED CUSTOMER COLUMN
    {
      accessorKey: "customer.customer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
    },

    {
      accessorKey: "mill.mill_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mill" />
      ),
    },

    {
      accessorKey: "job_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job Date" />
      ),
      cell: ({ row }) =>
        row.original.job_date
          ? new Date(row.original.job_date).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "approx_job_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Approx Weight" />
      ),
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        const color =
          status === "open"
            ? "bg-green-100 text-green-700"
            : status === "completed"
            ? "bg-blue-100 text-blue-700"
            : "bg-red-100 text-red-700";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<JobMaster>
          row={row}
          onEdit={() => {
            setSelectedJobId(row.original.id);
            setOpen(true);
          }}
          onDelete={(item) => console.log("Delete", item)}
        />
      ),
    },
  ];
}

export const searchColumns = jobMasterSchema.keyof()
  .options as (keyof JobMaster)[];
