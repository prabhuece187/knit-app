"use client";

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

import CommonHeader from "@/components/common/CommonHeader";
import { yarnTypeSchema } from "@/schema-types/master-schema";
import { usePostYarnTypeMutation } from "@/api/YarnTypeApi";
import { toast } from "sonner";

export default function AddYarnType({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postYarnType] = usePostYarnTypeMutation();

  const form = useForm<z.infer<typeof yarnTypeSchema>>({
    resolver: zodResolver(yarnTypeSchema),
  });

  function onSubmit(values: z.infer<typeof yarnTypeSchema>) {
    try {
      postYarnType(values)
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          form.reset();
          setOpen(false);
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to Add Yarn Type");
        });
    } catch (error) {
      toast.error(error + "Failed to Add Yarn Type");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl p-0
          [&>button]:top-[12%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted
        "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Add Yarn Type" />
          <p className="text-xs text-muted-foreground">
            Enter Yarn Type Details
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="yarn_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Yarn Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
                        placeholder="Enter Yarn Type"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yarn_gauge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Gauge</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Gauge (e.g. 24G)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dia */}
              <FormField
                control={form.control}
                name="yarn_dia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Dia</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Dia"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GSM */}
              <FormField
                control={form.control}
                name="yarn_gsm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">GSM</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter GSM"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
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
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
