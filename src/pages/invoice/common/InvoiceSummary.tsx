"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  type UseFormWatch,
  type Control,
  useFieldArray,
} from "react-hook-form";
import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";
import { Checkbox } from "@/components/ui/checkbox";

export function InvoiceSummary({
  control,
  watch,
  resetField,
}: {
  control: Control<FullInvoiceFormValues>;
  watch: UseFormWatch<FullInvoiceFormValues>;
  resetField: (name: keyof FullInvoiceFormValues) => void;
}) {
  const [showDiscount, setShowDiscount] = useState(false);

  const closeDiscount = () => {
    setShowDiscount(false);
    resetField("bill_discount_per");
    resetField("bill_discount_amount");
  };

  // ✅ useFieldArray with remove included
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additional_charges",
  });

  return (
    <div className="p-4 border rounded space-y-4">
      {/* ===== Add Discount Button ===== */}
      {!showDiscount && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowDiscount(true)}
        >
          ➕ Add Discount
        </Button>
      )}
      {/* ===== Discount Form ===== */}
      {showDiscount && (
        <div className="relative border rounded p-3">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={closeDiscount}
          >
            ×
          </button>
          {/* <h4 className="font-medium mb-2">Discount</h4> */}
          <div className="flex gap-3">
            <FormField
              control={control}
              name="bill_discount_per"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bill_discount_amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="₹" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
      {/* Render Additional Charges Rows */}
      {fields.length > 0 && (
        <div className="p-4 border rounded mt-3 space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-center">
              <FormField
                control={control}
                name={`additional_charges.${index}.additional_charge_name`}
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
                name={`additional_charges.${index}.additional_charge_amount`}
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
                name={`additional_charges.${index}.additional_tax`}
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
      )}
      {/* + Add Additional Charge Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          append({
            additional_charge_name: "",
            additional_charge_amount: 0,
            additional_tax: 0,
          })
        }
      >
        ➕ Add Additional Charge
      </Button>
      {/* Totals Section */}
      {/* ===== Totals Section ===== */}{" "}
      <div className="flex justify-between">
        {" "}
        <span>Taxable Value</span>{" "}
        <span>₹{watch("invoice_taxable_value") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex justify-between">
        {" "}
        <span>SGST</span> <span>₹{watch("invoice_sgst") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex justify-between">
        {" "}
        <span>CGST</span> <span>₹{watch("invoice_cgst") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex justify-between">
        {" "}
        <span>IGST</span> <span>₹{watch("invoice_igst") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex items-center justify-between">
        {" "}
        <span>Round Off</span>{" "}
        <Checkbox
          checked={(watch("round_off") ?? 0) !== 0}
          onCheckedChange={(val) => {
            console.log(val);
          }}
        />{" "}
      </div>{" "}
      <div className="flex justify-between font-semibold pt-2 border-t">
        {" "}
        <span>Total</span> <span>₹{watch("invoice_total") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex justify-between">
        {" "}
        <span>Amount Received</span>{" "}
        <span>₹{watch("amount_received") ?? 0}</span>{" "}
      </div>{" "}
      <div className="flex justify-between font-bold text-green-600">
        {" "}
        <span>Balance Amount</span> <span>₹{watch("balance_amount") ?? 0}</span>{" "}
      </div>{" "}
    </div>
  );
}
