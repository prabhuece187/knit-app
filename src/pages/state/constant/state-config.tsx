import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { stateSchema, type State } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getStateColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedStateId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<State>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "state_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Name" />
      ),
    },
    {
      accessorKey: "state_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Code" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<State>
          row={row}
          onEdit={(item) => {
            setSelectedStateId(Number(item.id));
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

export const searchColumns = stateSchema.keyof().options as (keyof State)[];
