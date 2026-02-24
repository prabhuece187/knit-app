import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { type InwardWithRelations } from "@/schema-types/inward-schema";

export function getInwardColumns(
  handleEdit: (id: number) => void,
): ColumnDef<InwardWithRelations>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },

    {
      accessorKey: "inward_no",
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

