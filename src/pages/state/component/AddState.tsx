import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { stateSchema } from "@/schema-types/master-schema";
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
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import CommonHeader from "@/components/common/CommonHeader";
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
    defaultValues: {
      user_id: 1,
    },
  });

  function onSubmit(values: z.infer<typeof stateSchema>) {
    postState(values);
    setOpen(false);
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        <Dialog open={open} onOpenChange={setOpen}>
          {/* <DialogTrigger></DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <CommonHeader name={"Add State"} />
              </DialogTitle>
              <DialogDescription>
                {/* Make changes to customer details. Click save when you're done. */}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 px-2 py-2">
              <div className="col-span-12">
                <Form {...form}>
                  <form
                    id="customer-form"
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
                                <Input
                                  type="hidden"
                                  placeholder="Enter the User Id"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="state_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the State Name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="state_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State Code*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the State Code"
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
                        <Button type="submit" className="m-1">
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
    </>
  );
}
