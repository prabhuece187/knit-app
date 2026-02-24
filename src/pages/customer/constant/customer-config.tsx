import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { customerSchema, type Customer } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getCustomerColumns(
  onEdit: (id: number) => void,
  onDelete?: (id: number) => void,
): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "customer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer Name" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        if (!id) return null;

        const encodedId = btoa(id.toString());

        return (
          <Link
            to={`/customers/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.customer_name}
          </Link>
        );
      },
    },
    {
      accessorKey: "state_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
    },
    {
      accessorKey: "customer_gst_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GST Number" />
      ),
    },
    {
      accessorKey: "customer_mobile",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile" />
      ),
    },
    {
      accessorKey: "customer_email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<Customer>
          row={row}
          onEdit={(customer) => onEdit(Number(customer.id))}
          onDelete={(customer) => onDelete?.(Number(customer.id))}
        />
      ),
    },
  ];
}

export const searchColumns = customerSchema.keyof()
  .options as (keyof Customer)[];
