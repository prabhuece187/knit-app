import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { customerSchema, type Customer } from "@/schema-types/master-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getCustomerColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCustomerId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<Customer>[] {

  const encoded = btoa("Customer");
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
    },
    {
      accessorKey: "customer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer Name" />
      ),
      cell: ({ row }) => (
        <Link
          to={`/customers/${row.original.id}/${encoded}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {row.original.customer_name}
        </Link>
      ),
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
        <DataTableColumnHeader column={column} title="Gst Number" />
      ),
    },
    {
      accessorKey: "customer_mobile",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile Number" />
      ),
    },
    {
      accessorKey: "customer_email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "customer_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={(customer) => {
            setSelectedCustomerId(Number(customer.id));
            setOpen(true);
          }}
          onDelete={(customer) => {
            // handle delete logic here
            console.log("Delete", customer);
          }}
        />
      ),
    },
  ];
}

export const searchColumns = customerSchema.keyof()
  .options as (keyof Customer)[];
