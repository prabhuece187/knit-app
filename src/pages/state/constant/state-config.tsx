import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { stateSchema, type State } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";


interface GetStateColumnsProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getStateColumns({
  onEdit,
  onDelete,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: GetStateColumnsProps): ColumnDef<State>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="ID"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="State Name"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
    },
    {
      accessorKey: "stateCode",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="State Code"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge
            variant={type === "STATE" ? "default" : "outline"}
            className="capitalize"
          >
            {type === "UNION_TERRITORY" ? "Union Territory" : type}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-medium">Actions</div>
      ),
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
