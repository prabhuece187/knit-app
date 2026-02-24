import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";

import {
  productionReturnSchema,
  type ProductionReturn,
  type ProductionReturnWithRelations,
} from "@/schema-types/production-return-schema";

export function getProductionReturnColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedRow: React.Dispatch<
    React.SetStateAction<ProductionReturnWithRelations | undefined>
  >,
): ColumnDef<ProductionReturnWithRelations>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },

    {
      accessorKey: "return_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return No" />
      ),
    },

   {
    accessorFn: (row) => row.job_master?.job_card_no ?? "-",
    id: "job_card",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job No" />
    ),
  },

    {
      accessorKey: "return_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Date" />
      ),
      cell: ({ row }) =>
        row.original.return_date
          ? new Date(row.original.return_date).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "return_weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Weight" />
      ),
    },

    {
      accessorKey: "return_reason",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reason" />
      ),
    },

    {
      accessorKey: "rework_required",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rework" />
      ),
      cell: ({ row }) => (row.original.rework_required ? "Yes" : "No"),
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<ProductionReturnWithRelations>
          row={row}
          onEdit={() => {
            setSelectedRow(row.original); // ✅ store full row
            setOpen(true);
          }}
        />
      ),
    },
  ];
}

export const searchColumns = productionReturnSchema.keyof()
  .options as (keyof ProductionReturn)[];
