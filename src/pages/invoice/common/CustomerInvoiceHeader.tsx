"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import type { Control } from "react-hook-form";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";
import type { Customer } from "@/schema-types/master-schema";

export function CustomerInvoiceHeader({
  control,
  customers,
}: {
  control: Control<FullInvoiceFormValues>;
  customers: Customer[];
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT SIDE */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="p-4 border rounded">
          <SelectPopover
            label="Bill To"
            placeholder="Select customer..."
            options={customers}
            valueKey="id"
            labelKey="customer_name"
            name="customer_id"
            control={control}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="Number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="invoice_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <FormControl>
                  <Input placeholder="Days" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
