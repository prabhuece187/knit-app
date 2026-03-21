"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  knittingReworkSchema,
  type KnittingRework,
} from "@/schema-types/rework-schema";

import { usePutReworkMutation } from "@/api/ProductionReworkApi";
import { SelectPopover } from "@/components/custom/CustomPopover";

import { useGetJobListQuery } from "@/api/JobMasterApi";
import { useGetProductionReturnListQuery } from "@/api/ProductionReturnApi";
import type { JobMaster } from "@/schema-types/master-schema";

export default function EditProductionRework({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: KnittingRework;
}) {
  const [updateRework] = usePutReworkMutation();

  // 🔹 Load dropdown data
  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const { data: returns = [] } = useGetProductionReturnListQuery({});

  const form = useForm<KnittingRework>({
    resolver: zodResolver(knittingReworkSchema),
    defaultValues: {
      rework_no: "",
      rework_date: "",
      production_return_id: 0,
      job_card_id: undefined,
      rework_weight: 0,
      remarks: "",
      user_id: 1,
    },
  });

  // ✅ Populate form when edit data loads
  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
  }, [data, form]);

  if (!data) return null;

  const onSubmit = async (values: KnittingRework) => {
    await updateRework({
      ...values,
      id: data.id!,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
      w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0
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
          <CommonHeader name="Edit Knitting Rework" />
          <p className="text-xs text-muted-foreground">Update rework details</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* 🔥 CLEAN GRID */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Rework No */}
              <FormField
                control={form.control}
                name="rework_no"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">
                      Rework No <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="h-10" />
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

              {/* Production Return */}
              <FormField
                control={form.control}
                name="production_return_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Production Return <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="[&>button]:h-10">
                        <SelectPopover
                          placeholder="Select Return..."
                          label=""
                          options={returns}
                          valueKey="id"
                          labelKey="return_no"
                          value={field.value}
                          onValueChange={(v) => field.onChange(Number(v))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rework Date */}
              <FormField
                control={form.control}
                name="rework_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rework Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rework Weight */}
              <FormField
                control={form.control}
                name="rework_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rework Weight <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-10"
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
              <Button variant="outline" onClick={() => setOpen(false)}>
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
