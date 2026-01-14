"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import { knittingMachineSchema } from "@/schema-types/master-schema";
import { usePostKnittingMachineMutation } from "@/api/KnittingMachineApi";

export default function AddKnittingMachine({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postMachine] = usePostKnittingMachineMutation();

  const form = useForm({
    resolver: zodResolver(knittingMachineSchema),
    defaultValues: {
      user_id: 1,
      machine_name: "",
      feeder: 0,
      model: "",
      machine_no: "",
      brand: "",
      dia: undefined,
      gauge: undefined,
      status: "active",
    },
  });

  function onSubmit(values: z.infer<typeof knittingMachineSchema>) {
    postMachine(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add Knitting Machine" />
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
                        <Input placeholder="KM-01" {...field} />
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
                        <Input placeholder="Fongs / DMS" {...field} />
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
                          placeholder="24"
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
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
