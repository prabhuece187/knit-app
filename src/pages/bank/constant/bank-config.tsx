import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { bankSchema, type Bank } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getBankColumns(
  onEdit: (id: number) => void,
  onDelete?: (id: number) => void,
): ColumnDef<Bank>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "bank_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bank Name" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        if (!id) return null;

        const encodedId = btoa(id.toString());

        return (
          <Link
            to={`/banks/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.bank_name}
          </Link>
        );
      },
    },
    {
      accessorKey: "branch_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branch" />
      ),
    },
    {
      accessorKey: "account_holder_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Holder" />
      ),
    },
    {
      accessorKey: "account_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account No" />
      ),
    },
    {
      accessorKey: "ifsc_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IFSC" />
      ),
    },
    {
      accessorKey: "bank_city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City" />
      ),
    },
    {
      accessorKey: "bank_state",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
    },
    {
      accessorKey: "is_default",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Default" />
      ),
      cell: ({ row }) =>
        row.original.is_default ? (
          <span className="text-green-600 font-semibold">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<Bank>
          row={row}
          onEdit={(bank) => onEdit(Number(bank.id))}
          onDelete={(bank) => onDelete?.(Number(bank.id))}
        />
      ),
    },
  ];
}

export const bankSearchColumns = bankSchema.keyof().options as (keyof Bank)[];
