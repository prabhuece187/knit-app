"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import CommonHeader from "@/components/common/CommonHeader";

import {
  productionReturnSchema,
  type ProductionReturn,
} from "@/schema-types/production-return-schema";

import {
  useGetNextReturnNoQuery,
  usePutReturnMutation,
} from "@/api/ProductionReturnApi";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import type { JobMaster } from "@/schema-types/master-schema";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { useGetKnittingProductionListQuery } from "@/api/KnittingProductionApi";
import type { KnittingProduction } from "@/schema-types/production-schema";

export default function EditProductionReturn({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: ProductionReturn; // optional
}) {
  const [updateReturn] = usePutReturnMutation();
  const { data: nextNoData } = useGetNextReturnNoQuery();

  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const { data: knittingProduction = [] } = useGetKnittingProductionListQuery(
    ""
  ) as {
    data: KnittingProduction[];
  };

  // Ensure form always has valid default values
  const form = useForm<ProductionReturn>({
    resolver: zodResolver(productionReturnSchema),
    defaultValues: {
      user_id: data?.user_id ?? 1,
      return_no: data?.return_no ?? "",
      job_card_id: data?.job_card_id ?? 0,
      production_id: data?.production_id ?? 0,
      return_date: data?.return_date ?? new Date().toISOString().slice(0, 10),
      return_weight: data?.return_weight
        ? parseFloat(data.return_weight as unknown as string) // <-- convert string to number
        : 0,
      return_reason: data?.return_reason ?? "other",
      rework_required: !!data?.rework_required,
      remarks: data?.remarks ?? "",
    },
  });

  // Auto-fill return_no only if adding new
  useEffect(() => {
    if (!data && nextNoData?.next_return_no) {
      form.setValue("return_no", nextNoData.next_return_no);
    }
  }, [data, nextNoData, form]);

  const onSubmit = async (values: ProductionReturn) => {
    if (!data?.id) return; // <-- safe guard
    await updateReturn({ id: data.id, ...values });
    setOpen(false);
  };

  // If no data yet, you can render nothing or a loader
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Knitting Production Return" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* LEFT SECTION */}
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4 p-4 border rounded">
                {/* Return No */}
                <FormField
                  control={form.control}
                  name="return_no"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-center">
                        Return No*
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Auto-generated"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Card */}
                <FormField
                  control={form.control}
                  name="job_card_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-center">
                        Job Card*
                      </label>
                      <FormControl>
                        <SelectPopover
                          placeholder="Select Job Card..."
                          label=""
                          options={jobCards}
                          valueKey="id"
                          labelKey="job_card_no"
                          value={field.value}
                          onValueChange={(val) => field.onChange(Number(val))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Production */}
                <FormField
                  control={form.control}
                  name="production_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-center">
                        Production
                      </label>
                      <FormControl>
                        <SelectPopover
                          placeholder="Select Production..."
                          label=""
                          options={knittingProduction}
                          valueKey="id"
                          labelKey="production_no"
                          value={field.value}
                          onValueChange={(val) => field.onChange(Number(val))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Return Date */}
                <FormField
                  control={form.control}
                  name="return_date"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-sm font-medium mb-1 text-center">
                        Return Date*
                      </label>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Return Weight */}
                <FormField
                  control={form.control}
                  name="return_weight"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-sm font-medium mb-1 text-center">
                        Return Weight (Kg)*
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseFloat(e.target.value) // <-- convert string to number
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* RIGHT SECTION */}
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4 p-4 border rounded">
                {/* Rework Required */}
                <FormField
                  control={form.control}
                  name="rework_required"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Rework Required
                      </label>
                      <FormControl>
                        <input
                          type="checkbox"
                          className="w-5 h-5"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Return Reason */}
                <FormField
                  control={form.control}
                  name="return_reason"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-center">
                        Return Reason
                      </label>
                      <FormControl>
                        <select
                          className="w-full border rounded px-3 py-2 text-sm"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : e.target.value
                            )
                          }
                        >
                          <option value="">Select Return Reason</option>
                          <option value="hole">Hole</option>
                          <option value="oil_stain">Oil Stain</option>
                          <option value="gsm_issue">GSM Issue</option>
                          <option value="dia_issue">Dia Issue</option>
                          <option value="other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remarks */}
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-center">
                        Remarks
                      </label>
                      <FormControl>
                        <Textarea placeholder="Optional remarks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
