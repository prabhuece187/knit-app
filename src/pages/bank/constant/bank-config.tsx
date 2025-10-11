import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { bankSchema, type Bank } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getBankColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>
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
        <DataTableColumnHeader column={column} title="Branch Name" />
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
        <DataTableColumnHeader column={column} title="Account Number" />
      ),
    },
    {
      accessorKey: "ifsc_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IFSC Code" />
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
    // {
    //   accessorKey: "bank_email",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Email" />
    //   ),
    // },
    // {
    //   accessorKey: "bank_mobile",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Mobile" />
    //   ),
    // },
    // {
    //   accessorKey: "bank_address",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Address" />
    //   ),
    // },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={(bank) => {
            setSelectedId(Number(bank.id));
            setOpen(true);
          }}
          onDelete={(bank) => {
            console.log("Delete", bank);
            // add delete logic here
          }}
        />
      ),
    },
  ];
}

// Optional: for search/filter columns
export const bankSearchColumns: (keyof Bank)[] = bankSchema.keyof().options;
