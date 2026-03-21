"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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

import {
  useGetYarnTypeByIdQuery,
  usePutYarnTypeMutation,
} from "@/api/YarnTypeApi";

export default function EditYarnType({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [putYarnType] = usePutYarnTypeMutation();

  const form = useForm<z.infer<typeof yarnTypeSchema>>({
    resolver: zodResolver(yarnTypeSchema),
  });

  const { data: member, isSuccess } = useGetYarnTypeByIdQuery(id, {
    skip: id === undefined,
  });

  useEffect(() => {
    if (isSuccess && member) {
      form.reset(member);
    }
  }, [isSuccess, member, form]);

  function onSubmit(values: z.infer<typeof yarnTypeSchema>) {
    putYarnType(values);
    setOpen(false);
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
          <CommonHeader name="Edit Yarn Type" />
          <p className="text-xs text-muted-foreground">
            Update Yarn Type Details
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
                      <Input className="h-10" {...field} />
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
