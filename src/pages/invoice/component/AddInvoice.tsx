"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  fullInvoiceSchema,
  type FullInvoiceFormValues,
} from "@/schema-types/invoice-schema";
import { InvoiceDetailsTable } from "../common/InvoiceDetailsTable";
import { CustomerInvoiceHeader } from "../common/CustomerInvoiceHeader";
import { NotesSummary } from "../common/NotesSummary";
import { BankDetails } from "../common/BankDetails";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import type { Customer } from "@/schema-types/master-schema";
import { InvoiceSummary } from "../common/InvoiceSummary";

// ✅ Components you already built

export default function AddInvoice() {
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  const form = useForm<FullInvoiceFormValues>({
    resolver: zodResolver(fullInvoiceSchema),
    defaultValues: {
      customer_id: 0,
      invoice_number: "",
      invoice_date: "",
      due_date: "",
      invoice_details: [
        {
          invoice_id: 0,
          item_id: 0,
          quantity: 1,
          price: 0,
        },
      ],
      additional_charges: [],
      bank_details: {
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        branch_name: "",
        account_holder: "",
      },
    },
  });
  const { control, setValue, watch, resetField } = form;

  const onSubmit = (values: FullInvoiceFormValues) => {
    console.log("Invoice Submitted ✅", values);
    // here you can call API -> saveInvoice(values)
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 1️⃣ Invoice Header */}
        <CustomerInvoiceHeader control={form.control} customers={customers} />

        {/* 2️⃣ Invoice Details Table */}
        <InvoiceDetailsTable
          name="invoice_details"
          control={control}
          setValue={setValue}
          watch={watch}
        />

        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* LEFT SIDE */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Notes & Terms */}
            <NotesSummary control={form.control} watch={watch} />

            {/* Bank Details (below Notes) */}
            <BankDetails control={form.control} />
          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Summary Box */}
            <InvoiceSummary
              control={form.control}
              watch={form.watch}
              resetField={resetField}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit">Save Invoice</Button>
        </div>
      </form>
    </FormProvider>
  );
}
