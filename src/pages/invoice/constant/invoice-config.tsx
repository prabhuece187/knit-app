import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { invoiceSchema, type Invoice } from "@/schema-types/invoice-schema";
import type { ColumnDef } from "@tanstack/react-table";

export function getInvoiceColumns(
  handleEdit: (invoice: Invoice) => void,
  handleDelete: (invoice: Invoice) => void
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "customer.customer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
    },
    {
      accessorKey: "invoice_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice No" />
      ),
    },
    {
      accessorKey: "invoice_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice Date" />
      ),
      cell: ({ row }) =>
        row.original.invoice_date
          ? new Date(row.original.invoice_date).toLocaleDateString()
          : "-",
    },
    {
      accessorKey: "invoice_total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
    },
    {
      accessorKey: "balance_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due" />
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
        <DataTableRowActions<Invoice>
          row={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];
}

export const searchColumns = invoiceSchema.keyof()
  .options as (keyof Invoice)[];
