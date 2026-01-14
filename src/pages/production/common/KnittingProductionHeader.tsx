"use client";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SelectPopover } from "@/components/custom/CustomPopover";

import type { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { FullKnittingProductionFormValues } from "@/schema-types/production-schema";
import type { JobMaster, KnittingMachine } from "@/schema-types/master-schema";

interface ProductionHeaderProps {
  control: Control<FullKnittingProductionFormValues>;
  watch: UseFormWatch<FullKnittingProductionFormValues>;
  setValue: UseFormSetValue<FullKnittingProductionFormValues>;
  jobCards: JobMaster[];
  machines: KnittingMachine[];
}

export function KnittingProductionHeader({
  control,
  watch,
  setValue,
  jobCards,
  machines,
}: ProductionHeaderProps) {

  const machineOptions = machines.map((m) => ({
    id: m.id!,
    machine_name: m.machine_name ?? m.machine_no,
  }));
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Job Card */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Job Card*
            </label>
            <SelectPopover
              placeholder="Select Job Card..."
              label=""
              options={jobCards}
              valueKey="id"
              labelKey="job_card_no"
              value={watch("job_card_id")}
              onValueChange={(val) =>
                setValue("job_card_id", Number(val), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          {/* Machine */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Machine
            </label>
            <SelectPopover
              placeholder="Select Machine..."
              label=""
              options={machineOptions}
              valueKey="id"
              labelKey="machine_name"
              value={watch("machine_id")}
              onValueChange={(val) =>
                setValue("machine_id", Number(val), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          {/* Production No (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Production No
            </label>
            <FormField
              control={control}
              name="production_no"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Shift */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Shift
            </label>
            <FormField
              control={control}
              name="shift"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="A / B / C" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-12 lg:col-span-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          {/* Production Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Production Date*
            </label>
            <FormField
              control={control}
              name="production_date"
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

          {/* Operator */}
          <div>
            <label className="block text-sm font-medium mb-1 text-center">
              Operator
            </label>
            <FormField
              control={control}
              name="operator_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Operator Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Remarks */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-center">
              Remarks
            </label>
            <FormField
              control={control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Remarks" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
