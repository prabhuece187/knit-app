import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { itemSchema, type Item } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

// Define TS type based on Zod schema

export function getItemColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedItemId: React.Dispatch<React.SetStateAction<number | null>>
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

        if (!id) return null; // secure the ID here
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
          onEdit={(item) => {
            setSelectedItemId(Number(item.id));
            setOpen(true);
          }}
          onDelete={(item) => {
            console.log("Delete", item);
          }}
        />
      ),
    },
  ];
}

export const searchColumns = itemSchema.keyof().options as (keyof Item)[];
