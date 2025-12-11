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
      {/* ---------------- LEFT SECTION ---------------- */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
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
            <label className="block text-center text-sm font-medium mb-1">
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
            <label className="block text-center text-sm font-medium mb-1">
              Inward No*
            </label>
            <FormField
              control={control}
              name="inward_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Inward No." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Invoice No */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Invoice No*
            </label>
            <FormField
              control={control}
              name="inward_invoice_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Invoice No." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT SECTION ---------------- */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Tin No */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              TIN No*
            </label>
            <FormField
              control={control}
              name="inward_tin_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter TIN No." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inward Date */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Inward Date*
            </label>
            <FormField
              control={control}
              name="inward_date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Vehicle No */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Vehicle No
            </label>
            <FormField
              control={control}
              name="inward_vehicle_no"
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

          {/* Status */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Status
            </label>
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Status" {...field} />
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
