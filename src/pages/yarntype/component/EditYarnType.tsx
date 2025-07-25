import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { yarnTypeSchema } from "@/schema-types/master-schema";
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


import { useEffect } from "react";
import CommonHeader from "@/components/common/CommonHeader";
import { useGetYarnTypeByIdQuery, usePutYarnTypeMutation } from "@/api/YarnTypeApi";

export default function EditYarnType({
  open,
  setOpen,
  yarnTypeId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  yarnTypeId: number;
}) {
  const [putYarnType] = usePutYarnTypeMutation();

  const form = useForm<z.infer<typeof yarnTypeSchema>>({
    resolver: zodResolver(yarnTypeSchema),
  });

  const { data: member, isSuccess } = useGetYarnTypeByIdQuery(yarnTypeId, {
    skip: yarnTypeId === undefined,
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <CommonHeader name={"Edit Yarn Type"} />
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid grid-cols-12 px-2 py-2">
            <div className="col-span-12">
              <Form {...form}>
                <form
                  id="yarn-type-form"
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

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="yarn_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yarn Type*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the Yarn Type"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 flex justify-end">
                      <Button
                        type="button"
                        className="m-1"
                        onClick={() => setOpen(false)}
                      >
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
  );
}
