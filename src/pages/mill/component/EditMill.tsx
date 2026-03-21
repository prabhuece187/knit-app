"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { millSchema } from "@/schema-types/master-schema";

import { useGetMillByIdQuery, usePutMillMutation } from "@/api/MillApi";

export default function EditMill({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [putMill] = usePutMillMutation();

  const form = useForm<z.infer<typeof millSchema>>({
    resolver: zodResolver(millSchema),
  });

  const { data: mill, isSuccess } = useGetMillByIdQuery(id, {
    skip: id === undefined,
  });

  useEffect(() => {
    if (isSuccess && mill) {
      form.reset(mill);
    }
  }, [isSuccess, mill, form]);

  function onSubmit(values: z.infer<typeof millSchema>) {
    putMill(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
          [&>button]:top-[5%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted
        "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Edit Mill" />
          <p className="text-xs text-muted-foreground">Update Mill Details</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Mill Name */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="mill_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Mill Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mobile */}
              <div>
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
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
