import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { millSchema } from "@/schema-types/master-schema"; // Adjust if your schema path differs
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useGetMillByIdQuery, usePutMillMutation } from "@/api/MillApi";

import { useEffect } from "react";
import CommonHeader from "@/components/common/CommonHeader";

export default function EditMill({
  open,
  setOpen,
  MillId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  MillId: number;
}) {
  const [putMill] = usePutMillMutation();

  const form = useForm<z.infer<typeof millSchema>>({
    resolver: zodResolver(millSchema),
  });

  const { data: mill, isSuccess } = useGetMillByIdQuery(MillId, {
    skip: MillId === undefined,
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
    <div className="px-4 lg:px-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <CommonHeader name="Edit Mill" />
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="grid grid-cols-12 px-2 py-2">
            <div className="col-span-12">
              <Form {...form}>
                <form
                  id="mill-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-3" hidden>
                      <FormField
                        control={form.control}
                        name="user_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Id</FormLabel>
                            <FormControl>
                              <Input type="hidden" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="mill_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mill Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the Mill Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="mobile_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Mobile Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 flex justify-end">
                      <Button type="button" className="m-1" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="m-1">
                        Submit
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
