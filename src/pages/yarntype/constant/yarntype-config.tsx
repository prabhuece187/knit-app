import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { yarnTypeSchema, type YarnType } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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
      cell: ({ row }) => {
        const id = row.original.id;

        if (!id) return null; // secure the ID here
        const encodedId = btoa(id.toString());
        return (
          <Link
            to={`/yarn_types/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.yarn_type}
          </Link>
        );
      },
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

export const searchColumns = yarnTypeSchema.keyof()
  .options as (keyof YarnType)[];
