import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import type { Customer, Mill } from "@/schema-types/master-schema";
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
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
      {/* LEFT */}
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

          {/* Outward No */}
          <FormField
            control={control}
            name="outward_no"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Outward No*
                </label>
                <FormControl>
                  <Input {...field} placeholder="Outward No" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Invoice No */}
          <FormField
            control={control}
            name="outward_invoice_no"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Invoice No*
                </label>
                <FormControl>
                  <Input {...field} placeholder="Invoice No" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Inward Id */}
          <FormField
            control={control}
            name="inward_id"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Inward ID*
                </label>
                <FormControl>
                  <Input {...field} type="number" placeholder="Inward ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Outward Date */}
          <FormField
            control={control}
            name="outward_date"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Outward Date*
                </label>
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

          {/* Vehicle No */}
          <FormField
            control={control}
            name="vehicle_no"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Vehicle No
                </label>
                <FormControl>
                  <Input {...field} placeholder="Vehicle No" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Process Type */}
          <FormField
            control={control}
            name="process_type"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Process Type
                </label>
                <FormControl>
                  <Input {...field} placeholder="Process Type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expected GSM */}
          <FormField
            control={control}
            name="expected_gsm"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Expected GSM
                </label>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="GSM"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expected DIA */}
          <FormField
            control={control}
            name="expected_dia"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Expected DIA
                </label>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="DIA"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Card No */}
          <FormField
            control={control}
            name="job_card_no"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm mb-1 text-center">
                  Job Card No
                </label>
                <FormControl>
                  <Input {...field} placeholder="Job card No" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remarks */}
          <FormField
            control={control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <label className="block text-sm mb-1 text-center">
                  Remarks
                </label>
                <FormControl>
                  <Input {...field} placeholder="Remarks" />
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
