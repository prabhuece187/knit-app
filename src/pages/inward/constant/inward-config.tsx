import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { inwardSchema, type Inward } from "@/schema-types/inward-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getInwardColumns(
  handleEdit: (inward: Inward) => void,
  handleDelete: (inward: Inward) => void
): ColumnDef<Inward>[] {
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
      accessorKey: "supplier_invoice_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supplier Invoice No" />
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
      accessorKey: "vehicle_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle No" />
      ),
    },

    {
      accessorKey: "lot_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lot No" />
      ),
    },

    {
      accessorKey: "no_of_bags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bags" />
      ),
    },

    {
      accessorKey: "total_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Weight" />
      ),
    },

    {
      accessorKey: "received_by",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Received By" />
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
