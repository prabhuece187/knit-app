import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { stateSchema, type State } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getStateColumns(
  onEdit: (id: number) => void,
  onDelete?: (id: number) => void,
): ColumnDef<State>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Name" />
      ),
    },
    {
      accessorKey: "stateCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Code" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<State>
          row={row}
          onEdit={(state) => onEdit(Number(state.id))}
          onDelete={(state) => onDelete?.(Number(state.id))}
        />
      ),
    },
  ];
}

export const searchColumns = stateSchema.keyof().options as (keyof State)[];
