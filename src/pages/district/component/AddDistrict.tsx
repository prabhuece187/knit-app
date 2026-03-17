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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/common/CommonHeader";
import { useCreateDistrictMutation } from "../api/DistrictApi";
import { useGetStateQuery } from "../../state/api/StateApi";
import { toast } from "sonner";
import { SelectPopover } from "@/components/custom/CustomPopover2";
import { useMemo, useState } from "react";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
export default function AddDistrict({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [stateSearchTerm, setStateSearchTerm] = useState("");

  const [createDistrict] = useCreateDistrictMutation();

  const debouncedSearchTerm = useDebounce(stateSearchTerm, 300);

  // Use paginated states query with debounced search
  const { data: statesResponse } = useGetStateQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedSearchTerm || undefined,
  });

  const states = useMemo(
    () => statesResponse?.data || [],
    [statesResponse?.data]
  );

  const form = useForm<District>({
    resolver: zodResolver(districtSchema),
  });

  const handleStateChange = (stateId: number | undefined) => {
    if (!stateId) return;
    form.setValue("stateId", stateId);
  };

  const handleSearchChange = (searchTerm: string) => {
    setStateSearchTerm(searchTerm);
  };



  function onSubmit(values: District) {
    createDistrict(values)
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        form.reset();
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <CommonHeader name={"Add District"} />
            </DialogTitle>
            <DialogDescription>
              Create a new district by filling in the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-12 px-2 py-2">
            <div className="col-span-12">
              <Form {...form}>
                <form
                  id="district-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
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
                        label="State *"
                        placeholder="Select state..."
                        options={states}
                        valueKey="id"
                        labelKey="name"
                        name="stateId"
                        control={form.control}
                        onValueChange={(selected) => {
                          console.log("handleDistrictChange called", selected);
                        }}
                        onSearchChange={handleSearchChange}
                      />

                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="m-1"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="m-1">
                        Create District
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
