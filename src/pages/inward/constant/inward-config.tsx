import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { inwardSchema, type Inward } from "@/schema-types/inward-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getInwardColumns( handleEdit: (inward: Inward) => void,
  handleDelete: (inward: Inward) => void): ColumnDef<Inward>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
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
      accessorKey: "inward_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inward No" />
      ),
    },
    {
      accessorKey: "inward_invoice_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice No" />
      ),
    },
    {
      accessorKey: "inward_tin_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tin No" />
      ),
    },
    {
      accessorKey: "inward_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inward Date" />
      ),
      cell: ({ row }) =>
        row.original.inward_date
          ? new Date(row.original.inward_date).toLocaleDateString()
          : "-",
    },
    {
      accessorKey: "total_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Weight" />
      ),
    },
    {
      accessorKey: "total_quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Quantity" />
      ),
    },
    {
      accessorKey: "inward_vehicle_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle No." />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<Inward>
          row={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];
}

export const searchColumns = inwardSchema.keyof().options as (keyof Inward)[];
