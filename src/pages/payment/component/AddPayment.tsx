"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/store/Store";
import PaymentHeader from "../common/PaymentHeader";
import { InvoiceSettlementTable } from "../common/InvoiceSettlementTable";
import { PaymentActions } from "../common/PaymentActions";

import {
  updateField,
  toggleInvoice,
  updateApplyAmount,
  resetPaymentForm,
  setInvoices,
  selectPaymentForm,
} from "@/slice/PaymentFormSlice";

import { useGetCustomerListQuery } from "@/api/CustomerApi";


import type { Customer } from "@/schema-types/master-schema";
import {
  fullPaymentSchema,
  type InvoicePayment,
} from "@/schema-types/paymennt-schema";
import { useGetCustomerInvoicesQuery, usePostPaymentMutation } from "@/api/PaymentApi";
import { useNavigate } from "react-router-dom";
import z from "zod";

export default function AddPaymentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const paymentForm = useSelector(selectPaymentForm);
  const { total_amount, invoices } = paymentForm;

  // Customers
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  // Customer invoices
  const { data: invoiceRes } = useGetCustomerInvoicesQuery(
    { customer_id: paymentForm.customer_id },
    { skip: paymentForm.customer_id === 0 }
  );

  // Load invoices from API
  useEffect(() => {
    if (invoiceRes?.invoices) dispatch(setInvoices(invoiceRes.invoices));
  }, [invoiceRes, dispatch]);

  // Auto-distribute amounts (like MyBillBook)
  const invoiceDeps = useMemo(
    () =>
      invoices
        .map((i) => `${i.id}-${i.pending_amount}-${i.is_selected}`)
        .join(","),
    [invoices]
  );

  useEffect(() => {
    let remaining = total_amount;
    invoices.forEach((inv, idx) => {
      const applied = Math.min(inv.pending_amount ?? 0, remaining);
      remaining -= applied;

      if (inv.apply_amount !== applied)
        dispatch(updateApplyAmount({ index: idx, value: applied }));

      if (
        (applied > 0 && !inv.is_selected) ||
        (applied === 0 && inv.is_selected)
      )
        dispatch(toggleInvoice(idx));
    });
  }, [total_amount, invoiceDeps, dispatch, invoices]);

  // Calculate used and balance
  const used = invoices.reduce((sum, inv) => sum + (inv.apply_amount ?? 0), 0);
  const balance = total_amount - used;

  // Payment mutation
  const [postPayment, { isLoading }] = usePostPaymentMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

 const handleSavePayment = async () => {
   try {
     setErrors({}); // clear previous errors

     const paymentToSend: InvoicePayment = {
       payment_date: paymentForm.payment_date,
       customer_id: paymentForm.customer_id,
       payment_type: paymentForm.payment_type,
       reference_no: paymentForm.reference_no,
       total_amount: paymentForm.total_amount,
       payment_details: invoices
         .filter((inv) => inv.is_selected && (inv.apply_amount ?? 0) > 0)
         .map((inv) => ({
           invoice_id: inv.id,
           amount: inv.apply_amount ?? 0,
         })),
     };

     // Zod validation
     fullPaymentSchema.parse(paymentToSend);

     // Send to server
     await postPayment(paymentToSend).unwrap();

     dispatch(resetPaymentForm());

     // IMPORTANT: fully refresh page after redirect
     navigate("/payment", { replace: true });
     setTimeout(() => window.location.reload(), 50);
   } catch (error: unknown) {
     if (error instanceof z.ZodError) {
       const formatted: Record<string, string> = {};
       error.issues.forEach((issue) => {
         const field = issue.path.join(".");
         formatted[field] = issue.message;
       });
       setErrors(formatted);
       return; // STOP redirect
     }

     alert("Something went wrong"); 
   }
 };


  return (
    <div className="p-5">
      <PaymentHeader
        data={paymentForm}
        onChange={(field, value) => dispatch(updateField({ field, value }))}
        customers={customers}
        errors={errors}
      />

      <InvoiceSettlementTable
        invoices={invoices}
        totalAmount={total_amount}
        onInvoiceToggle={(id, checked) => {
          const index = invoices.findIndex((i) => i.id === id);
          if (index >= 0 && invoices[index].is_selected !== checked)
            dispatch(toggleInvoice(index));
        }}
        onAmountChange={(id, amount) => {
          const index = invoices.findIndex((i) => i.id === id);
          if (index >= 0) dispatch(updateApplyAmount({ index, value: amount }));
        }}
      />

      <PaymentActions
        total={total_amount}
        used={used}
        balance={balance}
        loading={isLoading}
        onReset={() => dispatch(resetPaymentForm())}
        onSubmit={handleSavePayment}
      />
    </div>
  );
}
