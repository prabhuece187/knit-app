"use client";

import { useEffect } from "react";
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

import {
  jobMasterSchema,
  type JobMaster,
  type Customer,
  type Mill,
} from "@/schema-types/master-schema";

import type { Inward } from "@/schema-types/inward-schema";
import { useGetJobByIdQuery, usePutJobMutation } from "@/api/JobMasterApi";

interface Props {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customers: Customer[];
  mills: Mill[];
  inwards: Inward[];
}

export default function EditJobMaster({
  id,
  open,
  setOpen,
  customers,
  mills,
  inwards,
}: Props) {
  const { data: job, isLoading } = useGetJobByIdQuery(id, {
    skip: !id,
  });
  const [updateJob] = usePutJobMutation();

  const form = useForm<JobMaster>({
    resolver: zodResolver(jobMasterSchema),
  });

  console.log(job);

  /* ----------------------------------
     PREFILL FORM WHEN DATA LOADS
  ---------------------------------- */
  useEffect(() => {
    if (!job) return;

    form.reset({
      id: job.id,
      user_id: job.user_id,
      job_card_no: job.job_card_no,
      job_date: job.job_date,
      inward_id: job.inward_id,
      customer_id: job.customer_id,
      mill_id: job.mill_id,
      approx_job_weight: Number(job.approx_job_weight), 
      expected_delivery_date: job.expected_delivery_date,
      remarks: job.remarks ?? "",
      status: job.status,
    });
  }, [job, form]);

  /* ----------------------------------
     AUTO FILL FROM INWARD
  ---------------------------------- */
  const inwardId = form.watch("inward_id");

  useEffect(() => {
    if (!inwardId) return;

    const selectedInward = inwards.find((i) => i.id === inwardId);
    if (!selectedInward) return;

    form.setValue("customer_id", selectedInward.customer_id);
    form.setValue("mill_id", selectedInward.mill_id);
    form.setValue("approx_job_weight", selectedInward.total_weight);
  }, [inwardId, inwards, form]);

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const onSubmit = async (values: JobMaster) => {
    const { id: _id, ...payload } = values; // remove id from form values
    console.log(_id);

    try {
      await updateJob({
        id, // ONLY id from prop
        ...payload,
      }).unwrap();

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Job Master" />
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
                          <Input {...field} disabled />
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

                {/* Approx Weight */}
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
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Expected Date */}
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

                {/* Status */}
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
              <div className="col-span-12 lg:col-span-6 p-4 border rounded">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="h-full" />
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
              <Button type="submit">Update Job</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
