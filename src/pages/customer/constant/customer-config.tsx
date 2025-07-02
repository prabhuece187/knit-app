import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader"
import { DataTableRowActions } from "@/components/common/DataTableRowAction"
import  { customerSchema } from "@/schema-types/master-schema"
import type { ColumnDef } from "@tanstack/react-table"
import type z from "zod"

export type Customer = z.infer<typeof customerSchema>

export function getCustomerColumns(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCustomerId: React.Dispatch<React.SetStateAction<number | null>>
): ColumnDef<customerSchema>[] {
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
    },
    {
      accessorKey: "customer_state",
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
          setOpen={setOpen}
          setSelectedCustomerId={setSelectedCustomerId}
        />
      ),
    },
  ];
}


export const searchColumns = customerSchema.keyof().options as (keyof Customer)[]
