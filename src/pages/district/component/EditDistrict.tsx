import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { districtSchema, type District } from "../schema-types/district-schema";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateDistrictMutation } from "../api/DistrictApi";
import { useGetStateQuery } from "../../state/api/StateApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SelectPopover } from "@/components/custom/CustomPopover2";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { ensureOptionInList, toIdNameOptions } from "@/utility/option-utils";
import { XIcon } from "lucide-react"

export default function EditDistrict({
  open,
  setOpen,
  district,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  district: District;
}) {

  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [updateDistrict] = useUpdateDistrictMutation();

  const debouncedSearchTerm = useDebounce(stateSearchTerm, 300);

  const { data: statesResponse } = useGetStateQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedSearchTerm || undefined,
  });

  const baseStates = toIdNameOptions(statesResponse?.data);

  const form = useForm<District>({
    resolver: zodResolver(districtSchema),
  });

  const fallbackState =
    district?.stateId &&
      district?.state
      ? { id: district.stateId, name: district.state.name }
      : null;

  const states = ensureOptionInList(baseStates, fallbackState);


  useEffect(() => {
    if (district?.id) {
      form.reset(district);
    }
  }, [district]);

  function onSubmit(values: District) {
    const updateData = {
      name: values.name,
      districtCode: values.districtCode,
      stateId: values.stateId,
    };

    updateDistrict({ id: district.id as number, data: updateData })
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        form.reset();
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to update district");
      });
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  const handleClose = (value: boolean) => {
    if (!value) form.reset();
    setStateSearchTerm("")
    setOpen(value)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => handleClose(value)}>
        <DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="district-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <DialogHeader>

                <DialogTitle className="flex bg-muted/50 rounded-md px-2 py-3 items-center justify-between">
                  <div className="text-md font-medium px-1">Edit District</div>

                  <DialogClose className=" opacity-70 transition-opacity hover:opacity-100 rounded-xs focus:outline-none disabled:pointer-events-none">
                    <XIcon className="size-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </DialogTitle>

                <DialogDescription className="px-2">
                  Update district information. Click save when you're done.
                </DialogDescription>

              </DialogHeader>

              <div className="grid grid-cols-12 px-2">
                <div className="col-span-12">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District Name*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the District Name"
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
                        name="districtCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District Code*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the District Code (e.g., MUM, DEL)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <SelectPopover
                        label="State"
                        placeholder="Select state..."
                        options={states}
                        valueKey="id"
                        labelKey="name"
                        name="stateId"
                        control={form.control}
                        onSearchChange={setStateSearchTerm}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="m-1"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="m-1">
                  Update District
                </Button>
              </DialogFooter>

            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
