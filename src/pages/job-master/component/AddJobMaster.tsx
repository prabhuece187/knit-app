"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  // DialogHeader,
  // DialogTitle,
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
import { SelectPopover } from "@/components/custom/CustomPopover";

import { jobMasterSchema, type JobMaster } from "@/schema-types/master-schema";

import { useGetNextJobNoQuery, usePostJobMutation } from "@/api/JobMasterApi";
import type { Inward } from "@/schema-types/inward-schema";
import type { Customer, Mill } from "@/schema-types/master-schema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customers: Customer[];
  mills: Mill[];
  inwards: Inward[];
}

export default function AddJobMaster({
  open,
  setOpen,
  customers,
  mills,
  inwards,
}: Props) {
  const [postJob] = usePostJobMutation();
  const { data: nextJobNo } = useGetNextJobNoQuery();

  const form = useForm<JobMaster>({
    resolver: zodResolver(jobMasterSchema),
    defaultValues: {
      job_card_no: "",
      job_date: new Date().toISOString().slice(0, 10),
      expected_delivery_date: new Date().toISOString().slice(0, 10),
      inward_id: 0,
      customer_id: 0,
      mill_id: 0,
      approx_job_weight: undefined,
      remarks: "",
      status: "open",
    },
  });

  const inwardId = form.watch("inward_id");

  useEffect(() => {
    if (!inwardId) return;

    const selectedInward = inwards.find((i) => i.id === inwardId);

    if (!selectedInward) return;

    // AUTO FILL FROM INWARD
    form.setValue("customer_id", selectedInward.customer_id);
    form.setValue("mill_id", selectedInward.mill_id);
    form.setValue("approx_job_weight", selectedInward.total_weight);
    form.setValue("remarks", selectedInward.remarks ?? "");
  }, [inwardId, inwards, form]);

  useEffect(() => {
    if (open && nextJobNo?.job_no) {
      form.setValue("job_card_no", nextJobNo.job_no);
    }
  }, [open, nextJobNo, form]);

  const onSubmit = async (values: JobMaster) => {
    try {
      await postJob(values).unwrap();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
      w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
      [&>button]:top-[6%]
      [&>button]:-translate-y-1/2
      [&>button]:right-4
      [&>button]:rounded-full
      [&>button]:p-1.5
      [&>button]:hover:bg-muted
    "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Add Job Master" />
          <p className="text-xs text-muted-foreground">
            Enter Job Master Details
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* 🔥 FIXED GRID SPACING */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Job No */}
              <FormField
                control={form.control}
                name="job_card_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Job No</FormLabel>
                    <FormControl>
                      <Input className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Date */}
              <FormField
                control={form.control}
                name="job_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Inward */}
              <div className="space-y-2 [&>label]:mb-1 ">
                <FormLabel>Inward</FormLabel>
                <div className="h-10">
                  <SelectPopover
                    label=""
                    placeholder="Select Inward..."
                    options={inwards}
                    valueKey="id"
                    labelKey="inward_no"
                    value={form.watch("inward_id")}
                    onValueChange={(val) =>
                      form.setValue("inward_id", Number(val), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
              </div>

              {/* Customer */}
              <div className="space-y-2 [&>label]:mb-1">
                <FormLabel>Customer</FormLabel>
                <div className="h-10">
                  <SelectPopover
                    label=""
                    placeholder="Select customer..."
                    options={customers}
                    valueKey="id"
                    labelKey="customer_name"
                    value={form.watch("customer_id")}
                    onValueChange={(val) =>
                      form.setValue("customer_id", Number(val), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
              </div>

              {/* Mill */}
              <div className="space-y-2 [&>label]:mb-1">
                <FormLabel>Mill</FormLabel>
                <div className="h-10">
                  <SelectPopover
                    label=""
                    placeholder="Select mill..."
                    options={mills}
                    valueKey="id"
                    labelKey="mill_name"
                    value={form.watch("mill_id")}
                    onValueChange={(val) =>
                      form.setValue("mill_id", Number(val), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
              </div>

              {/* Approx Job Weight */}
              <FormField
                control={form.control}
                name="approx_job_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approx Job Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expected Delivery Date */}
              <FormField
                control={form.control}
                name="expected_delivery_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-10 border rounded-md px-3 text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
                Create Job
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
