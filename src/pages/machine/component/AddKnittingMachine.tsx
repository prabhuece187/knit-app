"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
      <DialogContent
        className="
          w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-0
          [&>button]:top-[6%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted">
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Add Knitting Machine" />
          <p className="text-xs text-muted-foreground">Enter Machine Details</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Hidden */}
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => <Input type="hidden" {...field} />}
              />

              {/* Machine No */}
              <div>
                <FormField
                  control={form.control}
                  name="machine_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Machine No*</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="KM-01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
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
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
