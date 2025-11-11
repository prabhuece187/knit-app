"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CustomerInvoiceHeader } from "../common/CustomerInvoiceHeader";
import { InvoiceDetailsTable } from "../common/InvoiceDetailsTable";
import { NotesSummary } from "../common/NotesSummary";
import { InvoiceSummary } from "../common/InvoiceSummary";
import BillDiscount from "../common/BillDiscount";
import { AdditionalChargesTable } from "../common/AdditionalChargesTable";
import { BankDetails } from "../common/BankDetails";

import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetBankListQuery, useGetSingleBankDataQuery } from "@/api/BankApi";
import {
  useGetInvoiceByIdQuery,
  usePutInvoiceMutation,
} from "@/api/InvoiceApi";

import type { RootState } from "@/store/Store";
import type { Customer } from "@/schema-types/master-schema";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";
import { fullInvoiceSchema } from "@/schema-types/invoice-schema";
import { setFullInvoice } from "@/slice/InvoiceFormSlice";

interface FormErrors {
  header?: Record<string, string>;
  rows?: Record<number, Record<string, string>>;
  additionalCharges?: Record<number, Record<string, string>>;
}

export default function EditInvoice() {
  const { invoiceId } = useParams();
  const id = Number(invoiceId);

  const dispatch = useDispatch();
  const invoiceDataFromStore = useSelector(
    (state: RootState) => state.invoiceForm
  );

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  const { data: banksData = [] } = useGetBankListQuery();
  const { data: defaultBank } = useGetSingleBankDataQuery();

  const { data: existingInvoice, isLoading } = useGetInvoiceByIdQuery(id, {
    skip: !id,
  });

  const [updateInvoice] = usePutInvoiceMutation();
  const [errors, setErrors] = useState<FormErrors>({});

  const methods = useForm<FullInvoiceFormValues>({
    defaultValues: invoiceDataFromStore,
  });

  const { handleSubmit, reset, setValue, getValues } = methods;

  // ---------------- Populate form on API load ----------------
  useEffect(() => {
    if (existingInvoice) {
      const mappedInvoice: FullInvoiceFormValues = {
        ...existingInvoice,
        invoice_details: existingInvoice.Items || [],
        additional_charges: existingInvoice.AdditionalCharges || [],
      };
      dispatch(setFullInvoice(mappedInvoice)); // update Redux
      reset(mappedInvoice); // update RHF view
    }
  }, [existingInvoice, dispatch, reset]);

  // ---------------- Sync form with Redux (Option A) ----------------
  useEffect(() => {
    reset(invoiceDataFromStore); // always reset form values when Redux changes
  }, [invoiceDataFromStore, reset]);

  // ---------------- Set default bank ----------------
  useEffect(() => {
    const currentBankId = getValues("bank_id");
    if (defaultBank?.id && !currentBankId) {
      setValue("bank_id", defaultBank.id);
    }
  }, [defaultBank, getValues, setValue]);

  // ---------------- Submit Handler ----------------
  const handleUpdateInvoice = () => {
    const latestInvoiceData = { ...invoiceDataFromStore }; // always get from Redux
    const result = fullInvoiceSchema.safeParse(latestInvoiceData);

    console.log(latestInvoiceData);

    if (result.success) {
      updateInvoice({ id, ...latestInvoiceData });
      console.log("✅ Invoice updated successfully:", latestInvoiceData);
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

  if (isLoading) {
    return <div className="text-center py-10">Loading invoice...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleUpdateInvoice)} className="space-y-6">
        <CustomerInvoiceHeader customers={customers} errors={errors.header} />
        <InvoiceDetailsTable rowErrors={errors.rows} />

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <NotesSummary />
            {defaultBank && (
              <BankDetails bank={defaultBank} banksData={banksData} />
            )}
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-6">
            <BillDiscount />
            <AdditionalChargesTable rowErrors={errors.additionalCharges} />
            <InvoiceSummary />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Update Invoice</Button>
        </div>
      </form>
    </FormProvider>
  );
}
