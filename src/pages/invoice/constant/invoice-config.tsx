import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import type { Invoice } from "@/schema-types/invoice-schema";

export function getInvoiceColumns(
  handleEdit: (invoice: Invoice) => void,
  handleDelete: (invoice: Invoice) => void,
  navigate?: (path: string) => void,
  handlePrint?: (invoice: Invoice) => void,
): ColumnDef<Invoice>[] {
  const defaultHandlePrint = (invoice: Invoice) => {
    if (navigate) navigate(`/printinvoice/${invoice.id}`);
  };

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
      accessorKey: "invoice_number",
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
          onPrint={handlePrint || defaultHandlePrint}
        />
      ),
    },
  ];
}

// Searchable fields
export const searchColumns: (keyof Invoice)[] = [
  "id",
  "invoice_number",
  "invoice_date",
  "invoice_total",
  "balance_amount",
  "customer_id",
];
