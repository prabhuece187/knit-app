import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { itemSchema, type Item } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";

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
