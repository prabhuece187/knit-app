"use client";

import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";

export function AdditionalChargesTable({
  control,
  name,
}: {
  control: Control<FullInvoiceFormValues>;
  name: "additional_charges";
}) {
  const { fields, remove } = useFieldArray({ control, name });

  if (fields.length === 0) return null; // hide table if no rows

  return (
    <div className="p-4 border rounded mt-3 space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-3 items-center">
          <FormField
            control={control}
            name={`${name}.${index}.additional_charge_name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Charge Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.${index}.additional_charge_amount`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input type="number" placeholder="Amount" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.${index}.additional_tax`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <select
                    className="w-full border rounded px-2 py-1"
                    {...field}
                  >
                    <option value={0}>No Applicable Tax</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="w-6 h-6 p-0 flex items-center justify-center"
            onClick={() => remove(index)}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}
