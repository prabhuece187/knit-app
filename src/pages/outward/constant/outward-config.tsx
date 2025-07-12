import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { outwardSchema, type Outward } from "@/schema-types/outward-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getOutwardColumns(
  handleEdit: (outward: Outward) => void,
  handleDelete: (outward: Outward) => void
): ColumnDef<Outward>[] {
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
      accessorKey: "outward_tin_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tin No" />
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
      accessorKey: "total_quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Quantity" />
      ),
    },
    {
      accessorKey: "outward_vehicle_no",
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
      accessorKey: "yarn_send",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Yarn Send" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<Outward>
          row={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];
}

export const searchColumns = outwardSchema.keyof().options as (keyof Outward)[];
