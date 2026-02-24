import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import type { KnittingReworkWithRelations } from "@/schema-types/rework-schema";

export function getKnittingReworkColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedRow: React.Dispatch<
    React.SetStateAction<KnittingReworkWithRelations | undefined>
  >,
): ColumnDef<KnittingReworkWithRelations>[] {
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
      accessorFn: (row) => row.production_return?.return_no ?? "-",
      id: "return_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return No" />
      ),
    },
    {
      accessorFn: (row) => row.job_master?.job_card_no ?? "-",
      id: "job",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job No" />
      ),
    },
    {
      accessorKey: "rework_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
    },
    {
      accessorKey: "rework_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Weight" />
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
        <DataTableRowActions<KnittingReworkWithRelations>
          row={row}
          onEdit={() => {
            setSelectedRow(row.original);
            setOpen(true);
          }}
        />
      ),
    },
  ];
}

export const searchColumns = [
  "rework_no",
  "rework_date",
  "rework_weight",
  "remarks",
] as const;
