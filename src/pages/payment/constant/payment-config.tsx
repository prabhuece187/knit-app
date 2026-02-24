import type { useDeletePaymentMutation } from "@/api/PaymentApi";
import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { InvoicePayment } from "@/schema-types/paymennt-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function getPaymentColumns(
  deletePayment: ReturnType<typeof useDeletePaymentMutation>[0],
): ColumnDef<InvoicePayment>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "payment_no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment No" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        if (!id) return "-";
        const encodedId = btoa(id.toString());
        return (
          <Link
            to={`/payments/${encodedId}`}
            className="text-violet-600 hover:underline font-medium"
          >
            {row.original.payment_no ?? "-"}
          </Link>
        );
      },
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => row.original.payment_date ?? "-",
    },
    {
      id: "customer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer Name" />
      ),
      cell: ({ row }) => {
        const customer = row.original.invoices?.[0]?.customer;
        return customer?.customer_name ?? row.original.customer_name ?? "-";
      },
    },
    {
      accessorKey: "payment_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <span>₹{Number(row.original.total_amount).toFixed(2)}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<InvoicePayment>
          row={row}
          onDelete={async (payment) => {
            if (!payment.id) return;
            if (!confirm("Are you sure you want to delete this payment?"))
              return;
            try {
              await deletePayment(payment.id).unwrap();
              alert("Payment deleted successfully");
            } catch (error) {
              console.error(error);
              alert("Failed to delete payment");
            }
          }}
        />
      ),
    },
  ];
}

export const searchColumns: (keyof InvoicePayment)[] = [
  "payment_no",
  "customer_name",
  "payment_type",
];
