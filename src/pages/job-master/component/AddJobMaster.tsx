"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      user_id: 1,
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
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add Job Master" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-6 p-4 border rounded grid grid-cols-2 gap-4">
                {/* Job No */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Job No
                  </label>
                  <FormField
                    control={form.control}
                    name="job_card_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Job No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Job Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Job Date
                  </label>
                  <FormField
                    control={form.control}
                    name="job_date"
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

                {/* Inward */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Inward
                  </label>
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
                    value={form.watch("customer_id")}
                    onValueChange={(val) =>
                      form.setValue("customer_id", Number(val), {
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
                    value={form.watch("mill_id")}
                    onValueChange={(val) =>
                      form.setValue("mill_id", Number(val), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>

                {/* Approx Job Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Approx Job Weight
                  </label>
                  <FormField
                    control={form.control}
                    name="approx_job_weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Approx Job Weight"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Expected Delivery Date
                  </label>
                  <FormField
                    control={form.control}
                    name="expected_delivery_date"
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
                <div>
                  <label className="block text-sm font-medium mb-1 text-center">
                    Status
                  </label>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded px-3 py-2 text-sm"
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
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-span-12 lg:col-span-6 p-4 border rounded grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder="Remarks"
                          {...field}
                          className="h-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Job</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
