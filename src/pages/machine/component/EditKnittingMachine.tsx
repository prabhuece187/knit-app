"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CommonHeader from "@/components/common/CommonHeader";

import {
  knittingMachineSchema,
  type KnittingMachine,
} from "@/schema-types/master-schema";

import {
  useGetKnittingMachineByIdQuery,
  usePutKnittingMachineMutation,
} from "@/api/KnittingMachineApi";

export default function EditKnittingMachine({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [putMachine] = usePutKnittingMachineMutation();

  const form = useForm<z.infer<typeof knittingMachineSchema>>({
    resolver: zodResolver(knittingMachineSchema),
    defaultValues: {
      status: "active",
    },
  });

  const { data, isSuccess } = useGetKnittingMachineByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (id && isSuccess && data) {
      form.reset({
        ...data,
      });
    }
  }, [id, isSuccess, data, form]);

  function onSubmit(values: KnittingMachine) {
    putMachine(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-5xl sm:max-w-5xl overflow-y-auto rounded-xl p-0
          [&>button]:top-[6%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted"
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Edit Knitting Machine" />
          <p className="text-xs text-muted-foreground">
            Update Machine Details
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              {/* Repeat same fields like Add */}

              {/* Machine No */}
              <div>
                <FormField
                  control={form.control}
                  name="machine_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine No*</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Machine Name */}
              <div>
                <FormField
                  control={form.control}
                  name="machine_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine Name*</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Model */}
              <div>
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model*</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand */}
              <div>
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Feeder */}
              <div>
                <FormField
                  control={form.control}
                  name="feeder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeder</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="h-10"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Dia */}
              <div>
                <FormField
                  control={form.control}
                  name="dia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="h-10"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Gauge */}
              <div>
                <FormField
                  control={form.control}
                  name="gauge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gauge</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="h-10"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
