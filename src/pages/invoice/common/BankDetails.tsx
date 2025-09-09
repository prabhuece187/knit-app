"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";

export function BankDetails({
  control,
}: {
  control: Control<FullInvoiceFormValues>;
}) {
  return (
    <div className="p-4 border rounded mt-6">
      <h3 className="font-semibold mb-3">Bank Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="bank_details.account_holder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder</FormLabel>
              <FormControl>
                <Input placeholder="Enter account holder name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bank_details.bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter bank name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bank_details.account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter account number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bank_details.ifsc_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter IFSC code" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bank_details.branch_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
