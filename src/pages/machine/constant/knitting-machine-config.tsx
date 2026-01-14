import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { knittingMachineSchema, type KnittingMachine } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getKnittingMachineColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<KnittingMachine>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "machine_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Machine No" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        if (!id) return null;
        const encodedId = btoa(id.toString());
        return (
          <Link
            to={`/knitting-machines/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.machine_no}
          </Link>
        );
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Brand" />
      ),
    },
    {
      accessorKey: "dia",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dia" />
      ),
    },
    {
      accessorKey: "gauge",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gauge" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={(machine) => {
            setSelectedId(Number(machine.id));
            setOpen(true);
          }}
          onDelete={(machine) => {
            console.log("Delete", machine);
          }}
        />
      ),
    },
  ];
}

export const knittingMachineSearchColumns: (keyof KnittingMachine)[] =
  knittingMachineSchema.keyof().options;
