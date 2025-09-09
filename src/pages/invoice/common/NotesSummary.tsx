"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, UseFormWatch } from "react-hook-form";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";

export function NotesSummary({
  control,
//   watch,
}: {
  control: Control<FullInvoiceFormValues>;
  watch: UseFormWatch<FullInvoiceFormValues>;
}) {
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      {/* Notes & Terms */}
      <div className="col-span-12 lg:col-span-7">
        <div className="grid gap-4">
          <FormField
            control={control}
            name="invoice_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="invoice_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Terms & Conditions..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
