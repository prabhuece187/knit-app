import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import {
  knittingReworkSchema,
  type KnittingRework,
} from "@/schema-types/rework-schema";

export function getKnittingReworkColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedReworkId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<KnittingRework>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "rework_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rework No" />
      ),
    },
    {
      accessorKey: "production_return.return_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return No" />
      ),
    },
    {
      accessorKey: "job_master.job_card_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job Card No" />
      ),
    },
    {
      accessorKey: "rework_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rework Date" />
      ),
    },
    {
      accessorKey: "rework_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rework Weight" />
      ),
    },
    {
      accessorKey: "remarks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remarks" />
      ),
    },

    // Actions
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<KnittingRework>
          row={row}
          onEdit={(item) => {
            setSelectedReworkId(Number(item.id));
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

export const searchColumns = knittingReworkSchema.keyof()
  .options as (keyof KnittingRework)[];
