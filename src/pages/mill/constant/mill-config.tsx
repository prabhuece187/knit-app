import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { millSchema, type Mill } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getMillColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedMillId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<Mill>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "mill_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mill Name" />
      ),
    },
    {
      accessorKey: "mobile_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile Number" />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
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
        <DataTableRowActions<Mill>
          row={row}
          onEdit={(item) => {
            setSelectedMillId(Number(item.id));
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

export const searchColumns = millSchema.keyof().options as (keyof Mill)[];
