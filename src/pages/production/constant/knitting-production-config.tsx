// src/tables/knitting-production-columns.ts
import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import {
  knittingProductionSchema,
  type KnittingProduction,
} from "@/schema-types/production-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getKnittingProductionColumns(
  handleEdit: (row: KnittingProduction) => void,
  handleDelete: (row: KnittingProduction) => void
): ColumnDef<KnittingProduction>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },

    {
      accessorKey: "production_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Production No" />
      ),
    },

    {
      accessorKey: "job_master.job_card_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job Card" />
      ),
    },

    {
      accessorKey: "machine.machine_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Machine" />
      ),
    },

    {
      accessorKey: "production_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Production Date" />
      ),
      cell: ({ row }) =>
        row.original.production_date
          ? new Date(row.original.production_date).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "shift",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shift" />
      ),
    },

    {
      accessorKey: "operator_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Operator" />
      ),
    },

    {
      accessorKey: "remarks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remarks" />
      ),
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<KnittingProduction>
          row={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];
}

export const searchColumns = knittingProductionSchema.keyof()
  .options as (keyof KnittingProduction)[];
