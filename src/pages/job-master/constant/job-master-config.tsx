import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { type JobMasterWithRelations } from "@/schema-types/master-schema";
import { Link } from "react-router-dom";

export function getJobMasterColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>,
): ColumnDef<JobMasterWithRelations>[] {
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
      accessorFn: (row) => row.inward?.inward_no ?? "-",
      id: "inward",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inward No" />
      ),
    },

    {
      accessorFn: (row) => row.customer?.customer_name ?? "-",
      id: "customer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
    },

    {
      accessorFn: (row) => row.mill?.mill_name ?? "-",
      id: "mill",
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
        <DataTableRowActions<JobMasterWithRelations>
          row={row}
          onEdit={() => {
            setSelectedJobId(row.original.id);
            setOpen(true);
          }}
        />
      ),
    },
  ];
}
