import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { yarnTypeSchema, type YarnType } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getYarnTypeColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedYarnTypeId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<YarnType>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "yarn_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Yarn Type" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<YarnType>
          row={row}
          onEdit={(item) => {
            setSelectedYarnTypeId(Number(item.id));
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

export const searchColumns = yarnTypeSchema.keyof().options as (keyof YarnType)[];
