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
  knittingReworkSchema,
  type KnittingRework,
} from "@/schema-types/rework-schema";

import { SelectPopover } from "@/components/custom/CustomPopover";
import {
  useGetNextReworkNoQuery,
  usePostReworkMutation,
} from "@/api/ProductionReworkApi";
import { useGetProductionReturnListQuery } from "@/api/ProductionReturnApi";
import type { JobMaster } from "@/schema-types/master-schema";
import { useGetJobListQuery } from "@/api/JobMasterApi";

export default function AddProductionRework({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postRework] = usePostReworkMutation();
  const { data: nextNoData } = useGetNextReworkNoQuery();

  const { data: returns = [] } = useGetProductionReturnListQuery({});

  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  console.log(returns);

  const form = useForm<KnittingRework>({
    resolver: zodResolver(knittingReworkSchema),
    defaultValues: {
      rework_no: "",
      rework_date: new Date().toISOString().slice(0, 10),
      production_return_id: 0,
      job_card_id: undefined,
      rework_weight: 0,
      remarks: "",
      user_id: 1,
    },
  });

  // Auto-fill rework_no
  useEffect(() => {
    if (nextNoData?.next_rework_no) {
      form.setValue("rework_no", nextNoData.next_rework_no);
    }
  }, [nextNoData, form]);

  const onSubmit = async (values: KnittingRework) => {
    await postRework(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add Knitting Rework" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 border rounded">
              {/* Rework No */}
              <FormField
                control={form.control}
                name="rework_no"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <label className="block text-sm font-medium text-center">
                      Rework No*
                    </label>
                    <FormControl>
                      <Input {...field} readOnly />
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

              {/* Production Return */}
              <FormField
                control={form.control}
                name="production_return_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <label className="block text-sm font-medium text-center">
                      Production Return*
                    </label>
                    <FormControl>
                      <SelectPopover
                        placeholder="Select Return..."
                        label=""
                        options={returns}
                        valueKey="id"
                        labelKey="return_no"
                        value={field.value}
                        onValueChange={(v) => field.onChange(Number(v))}
                      />
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
                    <label className="block text-sm font-medium text-center">
                      Rework Date*
                    </label>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <label className="block text-sm font-medium text-center">
                      Rework Weight*
                    </label>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
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
                    <label className="block text-sm font-medium text-center">
                      Remarks
                    </label>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
