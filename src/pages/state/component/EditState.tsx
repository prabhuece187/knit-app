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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetStateByIdQuery, usePatchStateMutation } from "@/pages/state/api/StateApi";

import { useEffect } from "react";
import CommonHeader from "@/components/common/CommonHeader";

export default function EditState({
  open,
  setOpen,
  StateId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  StateId: number;
}) {
  // const formRef = useRef<HTMLFormElement>(null);

  const [patchState] = usePatchStateMutation();

  const form = useForm<z.infer<typeof stateSchema>>({
    resolver: zodResolver(stateSchema),
  });

  const { data: stateData, isSuccess } = useGetStateByIdQuery(StateId, {
    skip: StateId === undefined,
  });

  useEffect(() => {
    if (isSuccess && stateData) {
      form.reset(stateData);
    }
  }, [isSuccess, stateData, form]);

  function onSubmit(values: z.infer<typeof stateSchema>) {
    patchState(values).unwrap().then(() => {
      form.reset();
      setOpen(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger></DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <CommonHeader name={"Edit State"} />
            </DialogTitle>
            <DialogDescription></DialogDescription>
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

                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="name"
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
                        name="stateCode"
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

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State Type*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="STATE">State</SelectItem>
                                <SelectItem value="UNION_TERRITORY">
                                  Union Territory
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 flex justify-end">
                      <Button type="button" className="m-1" onClick={handleCancel}>
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
    </>
  );
}
