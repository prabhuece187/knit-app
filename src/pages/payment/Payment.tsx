import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { getPaymentColumns } from "./constant/payment-config";
import { useDataTable } from "@/hooks/useDataTable";
import { useGetPaymentQuery, useDeletePaymentMutation } from "@/api/PaymentApi";
import { useNavigate } from "react-router-dom";
import type { InvoiceItem, InvoicePayment } from "@/schema-types/paymennt-schema";

export default function Payment() {
  const navigate = useNavigate();

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<
    { limit: number; curpage: number; search: string },
    InvoicePayment
  >({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const { data, isLoading, isError } = useGetPaymentQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const [deletePayment] = useDeletePaymentMutation();

  // const handleEdit = useCallback(
  //   (id: number) => navigate(`/editpayment/${id}`),
  //   [navigate],
  // );

  const columns = useMemo(
    () => getPaymentColumns(deletePayment),
    [deletePayment],
  );

const paymentData: InvoicePayment[] = useMemo(() => {
  if (!data?.data) return []; // access the array inside `data`

  return data.data.map((p: InvoicePayment) => ({
    ...p,
    total_amount: Number(p.total_amount ?? 0),
    customer_name:
      p.invoices?.[0]?.customer?.customer_name ?? p.customer_name ?? "-",
    payment_details: p.payment_details ?? [],
    invoices: p.invoices?.map((inv: InvoiceItem) => ({
      ...inv,
      invoice_number: inv.invoice_number ?? inv.id.toString(),
      invoice_total: inv.invoice_total ?? 0,
      total_paid: inv.total_paid ?? 0,
      pending_amount: inv.pending_amount ?? 0,
    })),
  }));
}, [data]);

  
  return (
    <EnhancedDataTableCard
      name="Payments"
      columns={columns}
      data={paymentData}
      meta={data?.meta ?? pagination}
      loading={isLoading}
      isError={isError}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onSortChange={handleSortChange}
      onSearchChange={handleSearchChange}
      searchValue={searchTerm}
      searchPlaceholder="Search payments / customer..."
      trigger={
        <Button onClick={() => navigate("/addpayment")}>Add Payment</Button>
      }
    />
  );
}
