"use client";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SelectPopover } from "@/components/custom/CustomPopover";

import type { Customer, Mill } from "@/schema-types/master-schema";
import type { FullInwardFormValues } from "@/schema-types/inward-schema";
import type { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface InwardHeaderProps {
  control: Control<FullInwardFormValues>;
  watch: UseFormWatch<FullInwardFormValues>;
  setValue: UseFormSetValue<FullInwardFormValues>;
  customers: Customer[];
  mills: Mill[];
}

export function InwardHeader({
  control,
  watch,
  setValue,
  customers,
  mills,
}: InwardHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT SECTION */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Customer
            </label>
            <SelectPopover
              label=""
              placeholder="Select customer..."
              options={customers}
              valueKey="id"
              labelKey="customer_name"
              value={watch("customer_id")}
              onValueChange={(val) =>
                setValue("customer_id", Number(val), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          {/* Mill */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Mill
            </label>
            <SelectPopover
              label=""
              placeholder="Select mill..."
              options={mills}
              valueKey="id"
              labelKey="mill_name"
              value={watch("mill_id")}
              onValueChange={(val) =>
                setValue("mill_id", Number(val), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          {/* Inward No */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Inward No*
            </label>
            <FormField
              control={control}
              name="inward_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Inward No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Supplier Invoice No */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Supplier Invoice No
            </label>
            <FormField
              control={control}
              name="supplier_invoice_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Supplier Invoice No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Inward Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Inward Date*
            </label>
            <FormField
              control={control}
              name="inward_date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Vehicle No */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Vehicle No
            </label>
            <FormField
              control={control}
              name="vehicle_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Vehicle No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Lot No */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Lot No
            </label>
            <FormField
              control={control}
              name="lot_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Lot No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* No of Bags */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              No of Bags*
            </label>
            <FormField
              control={control}
              name="no_of_bags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Total Weight */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Total Weight*
            </label>
            <FormField
              control={control}
              name="total_weight"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Received By */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Received By*
            </label>
            <FormField
              control={control}
              name="received_by"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Person Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
