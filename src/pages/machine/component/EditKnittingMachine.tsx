"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // ✅ Same pattern as EditCustomer
  useEffect(() => {
    if (id && isSuccess && data) {
      form.reset({
        id: data.id,
        user_id: data.user_id,
        machine_no: data.machine_no,
        machine_name: data.machine_name ?? "",
        model: data.model ?? "",
        brand: data.brand ?? "",
        feeder: data.feeder ?? 0,
        dia: data.dia ?? null,
        gauge: data.gauge ?? null,
        status: data.status ?? "active",
      });
    }
  }, [id, isSuccess, data, form]);

  function onSubmit(values: KnittingMachine) {
    putMachine(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Knitting Machine" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-3">
              {/* Hidden Fields */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              {/* Machine No */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="machine_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine No*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Machine Name */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="machine_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Machine Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Machine Model */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine Model*</FormLabel>
                      <FormControl>
                        <Input placeholder="Machine Model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Feeder */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="feeder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeder</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="28"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Dia */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="dia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Gauge */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="gauge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gauge</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <div className="col-span-3">
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
                          <SelectTrigger>
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

            {/* Buttons */}
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
