import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { itemSchema } from "@/schema-types/master-schema";
import type { Item } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getItemColumns(
  onEdit: (id: number) => void,
  onDelete?: (id: number) => void,
): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "item_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item Name" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        if (!id) return null;

        const encodedId = btoa(id.toString());

        return (
          <Link
            to={`/items/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.item_name}
          </Link>
        );
      },
    },
    {
      accessorKey: "item_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item Code" />
      ),
    },
    {
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<Item>
          row={row}
          onEdit={(item) => onEdit(Number(item.id))}
          onDelete={(item) => onDelete?.(Number(item.id))}
        />
      ),
    },
  ];
}

export const searchColumns = itemSchema.keyof().options as (keyof Item)[];
