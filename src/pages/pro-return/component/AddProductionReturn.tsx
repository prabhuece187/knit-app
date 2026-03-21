"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
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
  usePostReturnMutation,
  useGetNextReturnNoQuery,
} from "@/api/ProductionReturnApi";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import type { JobMaster } from "@/schema-types/master-schema";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { useGetKnittingProductionListQuery } from "@/api/KnittingProductionApi";
import type { KnittingProduction } from "@/schema-types/production-schema";


export default function AddProductionReturn({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postReturn] = usePostReturnMutation();
  const { data: nextNoData } = useGetNextReturnNoQuery();

  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const { data: knittingProduction = [] } = useGetKnittingProductionListQuery(
    ""
  ) as {
    data: KnittingProduction[];
  };

  console.log(knittingProduction);

  const form = useForm<ProductionReturn>({
    resolver: zodResolver(productionReturnSchema),
    defaultValues: {
      return_no: "",
      job_card_id: 0,
      production_id: 0,
      return_date: new Date().toISOString().slice(0, 10),
      return_weight: 0,
      return_reason: "other",
      rework_required: false,
      remarks: "",
    },
  });

  // Auto-fill return_no
  useEffect(() => {
    if (nextNoData?.next_return_no) {
      form.setValue("return_no", nextNoData.next_return_no);
    }
  }, [nextNoData]);

  const onSubmit = async (values: ProductionReturn) => {
    await postReturn(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
      w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
      [&>button]:top-[5%]
      [&>button]:-translate-y-1/2
      [&>button]:right-4
      [&>button]:rounded-full
      [&>button]:p-1.5
      [&>button]:hover:bg-muted
    "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Knitting Production Return" />
          <p className="text-xs text-muted-foreground">
            Enter Production Return Details
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* 🔥 CLEAN GRID */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Return No */}
              <FormField
                control={form.control}
                name="return_no"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">
                      Return No <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Auto-generated"
                        readOnly
                        className="h-10"
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
                    <FormLabel>
                      Job Card <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="[&>button]:h-10">
                        <SelectPopover
                          placeholder="Select Job Card..."
                          label=""
                          options={jobCards}
                          valueKey="id"
                          labelKey="job_card_no"
                          value={field.value}
                          onValueChange={(val) => field.onChange(Number(val))}
                        />
                      </div>
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
                    <FormLabel>Production</FormLabel>
                    <FormControl>
                      <div className="[&>button]:h-10">
                        <SelectPopover
                          placeholder="Select Production..."
                          label=""
                          options={knittingProduction}
                          valueKey="id"
                          labelKey="production_no"
                          value={field.value}
                          onValueChange={(val) => field.onChange(Number(val))}
                        />
                      </div>
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
                    <FormLabel>
                      Return Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
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
                    <FormLabel>
                      Return Weight (Kg) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-10"
                        placeholder="Weight"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rework Required */}
              <FormField
                control={form.control}
                name="rework_required"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-lg">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <span className="text-sm font-medium">Rework Required</span>
                  </FormItem>
                )}
              />

              {/* Return Reason */}
              <FormField
                control={form.control}
                name="return_reason"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Return Reason</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 border rounded-md px-3 text-sm"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : e.target.value,
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
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-6">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
