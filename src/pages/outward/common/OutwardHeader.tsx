import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
//   FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import type { Customer, Mill } from "@/schema-types/master-schema";
import type { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { FullOutwardFormValues } from "@/schema-types/outward-schema";

interface OutwardHeaderProps {
  control: Control<FullOutwardFormValues>;
  customers: Customer[];
  mills: Mill[];
  watch: UseFormWatch<FullOutwardFormValues>;
  setValue: UseFormSetValue<FullOutwardFormValues>;
}

export default function OutwardHeader({
  control,
  customers,
  mills,
  watch,
  setValue,
}: OutwardHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ----------- LEFT SECTION ----------- */}
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

          {/* Outward No */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Outward No*
            </label>
            <FormField
              control={control}
              name="outward_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Outward No" {...field} />
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
              name="outward_invoice_no"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice No"
                      value={field.value ?? ""} // FIX 1: prevent undefined
                      onChange={(e) => field.onChange(e.target.value)} // FIX 2: always string
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inward Id */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Inward Id*
            </label>
            <FormField
              control={control}
              name="inward_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Inward Id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* ----------- RIGHT SECTION ----------- */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* TIN No */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              TIN No*
            </label>
            <FormField
              control={control}
              name="outward_tin_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter TIN No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Outward Date */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Outward Date*
            </label>
            <FormField
              control={control}
              name="outward_date"
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
              name="outward_vehicle_no"
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
                    <Input
                      placeholder="Enter Status"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Yarn Send */}
          <div>
            <label className="block text-center text-sm font-medium mb-1">
              Yarn Send
            </label>
            <FormField
              control={control}
              name="yarn_send"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Yarn Send" {...field} />
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
