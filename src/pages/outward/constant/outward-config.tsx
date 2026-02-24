import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { type OutwardWithRelations } from "@/schema-types/outward-schema";

export function getOutwardColumns(
  handleEdit: (id: number) => void,
): ColumnDef<OutwardWithRelations>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
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
      accessorFn: (row) => row.inward?.inward_no ?? "-",
      id: "inward",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inward No" />
      ),
    },

    {
      accessorKey: "outward_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Outward No" />
      ),
    },

    {
      accessorKey: "outward_invoice_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice No" />
      ),
    },

    {
      accessorKey: "vehicle_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle No" />
      ),
    },

    {
      accessorKey: "outward_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Outward Date" />
      ),
      cell: ({ row }) =>
        row.original.outward_date
          ? new Date(row.original.outward_date).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "total_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Weight" />
      ),
    },

    {
      accessorKey: "process_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Process Type" />
      ),
    },

    {
      accessorKey: "remarks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remarks" />
      ),
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={() => handleEdit(row.original.id!)}
        />
      ),
    },
  ];
}
