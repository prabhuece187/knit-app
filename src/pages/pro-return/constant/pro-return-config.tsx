import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import {
  productionReturnSchema,
  type ProductionReturn,
} from "@/schema-types/production-return-schema";

export function getProductionReturnColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedReturnId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<ProductionReturn>[] {
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
      accessorKey: "job_master.job_card_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Job ID" />
      ),
    },
    {
      accessorKey: "return_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Date" />
      ),
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
        <DataTableColumnHeader column={column} title="Return Reason" />
      ),
    },

    // Actions
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<ProductionReturn>
          row={row}
          onEdit={(item) => {
            setSelectedReturnId(Number(item.id));
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

export const searchColumns = productionReturnSchema.keyof()
  .options as (keyof ProductionReturn)[];
