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
import { stateSchema } from "@/schema-types/master-schema";
import { usePostStateMutation } from "@/api/StateApi";

export default function AddState({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postState] = usePostStateMutation();

  const form = useForm<z.infer<typeof stateSchema>>({
    resolver: zodResolver(stateSchema),
  });

  function onSubmit(values: z.infer<typeof stateSchema>) {
    postState(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
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
          <CommonHeader name="Add State" />
          <p className="text-xs text-muted-foreground">Enter State Details</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* State Name */}
              <div>
                <FormField
                  control={form.control}
                  name="state_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        State Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="Enter State Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* State Code */}
              <div>
                <FormField
                  control={form.control}
                  name="state_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        State Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 uppercase"
                          placeholder="TN"
                          {...field}
                        />
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
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
