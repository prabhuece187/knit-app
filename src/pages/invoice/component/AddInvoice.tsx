"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CustomerInvoiceHeader } from "../common/CustomerInvoiceHeader";
import { InvoiceDetailsTable } from "../common/InvoiceDetailsTable";
import { NotesSummary } from "../common/NotesSummary";
import { InvoiceSummary } from "../common/InvoiceSummary";
import BillDiscount from "../common/BillDiscount";
import { AdditionalChargesTable } from "../common/AdditionalChargesTable";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetBankListQuery, useGetSingleBankDataQuery } from "@/api/BankApi";
import { BankDetails } from "../common/BankDetails";
import type { Customer } from "@/schema-types/master-schema";
import type { RootState } from "@/store/Store";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";
import { fullInvoiceSchema } from "@/schema-types/invoice-schema";
import { usePostInvoiceMutation } from "@/api/InvoiceApi";

interface FormErrors {
  header?: Record<string, string>;
  rows?: Record<number, Record<string, string>>;
  additionalCharges?: Record<number, Record<string, string>>;
}

export default function AddInvoice() {
  const invoiceData = useSelector((state: RootState) => state.invoiceForm);
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  const { data: defaultBank } = useGetSingleBankDataQuery();

  const [postInvoice] = usePostInvoiceMutation();

  const { data: banksData = [] } = useGetBankListQuery();

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize React Hook Form
  const methods = useForm<FullInvoiceFormValues>({
    defaultValues: invoiceData,
  });

  const { handleSubmit, setValue } = methods;

  // Set default bank_id when data is loaded
  useEffect(() => {
    if (defaultBank && defaultBank.id !== undefined)
      setValue("bank_id", defaultBank.id);
  }, [defaultBank, setValue]);

  const handleSaveInvoice = () => {
    const result = fullInvoiceSchema.safeParse(invoiceData);

    if (result.success) {

      postInvoice(invoiceData);
      console.log("✅ Invoice saved successfully:", invoiceData);

      setErrors({});
    } else {
      const formattedErrors: FormErrors = {
        header: {},
        rows: {},
        additionalCharges: {},
      };
      result.error.errors.forEach((e) => {
        if (e.path[0] === "invoice_details") {
          const index = e.path[1] as number;
          const field = e.path[2] as string;
          if (!formattedErrors.rows![index]) formattedErrors.rows![index] = {};
          formattedErrors.rows![index][field] = e.message;
        } else if (e.path[0] === "additional_charges") {
          const index = e.path[1] as number;
          const field = e.path[2] as string;
          if (!formattedErrors.additionalCharges![index])
            formattedErrors.additionalCharges![index] = {};
          formattedErrors.additionalCharges![index][field] = e.message;
        } else {
          const field = e.path[0] as string;
          formattedErrors.header![field] = e.message;
        }
      });
      setErrors(formattedErrors);
      console.log("Validation Errors:", formattedErrors);
    }
  };

  return (
    // ✅ Wrap everything in FormProvider
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSaveInvoice)} className="space-y-6">
        <CustomerInvoiceHeader customers={customers} errors={errors.header} />
        <InvoiceDetailsTable rowErrors={errors.rows} />

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <NotesSummary />
            {defaultBank && (
              <BankDetails
                bank={defaultBank}
                banksData={banksData}
              />
            )}
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-6">
            <BillDiscount />
            <AdditionalChargesTable rowErrors={errors.additionalCharges} />
            <InvoiceSummary />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Save Invoice</Button>
        </div>
      </form>
    </FormProvider>
  );
}
