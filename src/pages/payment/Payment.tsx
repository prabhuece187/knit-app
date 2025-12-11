// src/pages/payment/Payment.tsx

import DataTableCard from "@/components/custom/DataTableCard";
import { Button } from "@/components/ui/button";
import { getPaymentColumns, searchColumns } from "./constant/payment-config";
import { useMemo, useState } from "react";
// import AddPayment from "./component/AddPayment";
import { useDeletePaymentMutation, useGetPaymentQuery } from "@/api/PaymentApi";
import { Link } from "react-router-dom";
import type { InvoicePayment } from "@/schema-types/paymennt-schema";
// import AddPayment from "./component/AddPayment";

// Define API response type (matches your backend)
interface PaymentApiResponse {
  id: number;
  payment_no?: string;
  customer_id: number;
  payment_date: string;
  payment_type: "cash" | "neft" | "cheque";
  amount: string | number; // comes as string from API
  reference_no?: string;
  invoices?: Array<{
    id: number;
    customer?: {
      customer_name: string;
    };
  }>;
}

export default function Payment() {
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response, // fallback to [] if undefined
    isLoading: stateLoading,
    isError,
  } = useGetPaymentQuery(
    {
      limit,
      offset,
      curpage,
      searchInput,
    },
    {
      skip: limit === 0 && offset === 0 && curpage === 0 && searchInput === "",
    }
  );

  const paymentData: InvoicePayment[] = useMemo(() => {
    if (!response) return [];

    return response.map((p: PaymentApiResponse) => ({
      ...p,
      total_amount: Number(p.amount), // convert string to number
      customer_name: p.invoices?.[0]?.customer?.customer_name ?? "-", // flatten customer
      payment_details: [], // optional, can be filled if you fetch details
      invoices: p.invoices?.map((inv) => ({
        id: inv.id,
        invoice_number: inv.id.toString(), // fallback if not present
        invoice_date: "",
        invoice_total: 0,
        total_paid: 0,
        pending_amount: 0,
        customer: inv.customer,
      })),
    }));
  }, [response]);

  const [deletePayment] = useDeletePaymentMutation();

  const [open, setOpen] = useState(false);
  // const [selectedId, setSelectedId] = useState<number | null>(null);
  // console.log(selectedId);

  const columns = getPaymentColumns( deletePayment);

  return (
    <>
      <DataTableCard
        name="Payments"
        columns={columns}
        data={paymentData}
        searchColumns={searchColumns}
        loading={stateLoading}
        open={open}
        setOpen={setOpen}
        isError={isError}
        trigger={
          <Button>
            <Link to="/addpayment">Add Payment</Link>
          </Button>
        }
      />
    </>
  );
}
