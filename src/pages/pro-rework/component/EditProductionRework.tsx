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
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Knitting Rework" />
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

              {/* Job Card (disabled) */}
              <FormField
                control={form.control}
                name="job_card_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <label className="block text-sm font-medium text-center">
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
                        onValueChange={() => {}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Production Return (disabled) */}
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
                        onValueChange={() => {}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rework Date (read-only) */}
              <FormField
                control={form.control}
                name="rework_date"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-center">
                      Rework Date*
                    </label>
                    <FormControl>
                      <Input type="date" {...field} readOnly />
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
                  <FormItem className="col-span-2">
                    <label className="block text-sm font-medium text-center">
                      Rework Weight*
                    </label>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
