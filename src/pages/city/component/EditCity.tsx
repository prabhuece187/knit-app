import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { citySchema, type City } from "../schema-types/city-schema";
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
import { useGetCityByIdQuery, useUpdateCityMutation } from "../api/CityApi";
import { useGetDistrictsQuery } from "@/pages/district/api/DistrictApi";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import CommonHeader from "@/components/common/CommonHeader";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";

export default function EditCity({
  open,
  setOpen,
  CityId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  CityId: number;
}) {
  const [districtSearchTerm] = useState("");
  const [updateCity] = useUpdateCityMutation();

  const debouncedSearchTerm = useDebounce(districtSearchTerm, 300);

  // Use paginated districts query with debounced search
  const { data: districtsResponse } = useGetDistrictsQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedSearchTerm || undefined,
  });

  const districts = useMemo(
    () =>
      districtsResponse?.data
        ?.filter((d) => d.id !== undefined)
        .map((d) => ({
          id: d.id as number,
          name: d.name,
        })) || [],
    [districtsResponse?.data]
  );

  const handleDistrictChange = (districtId: number | undefined) => {
    if (districtId) {
      form.setValue("districtId", districtId);
    }
  };

  const form = useForm<City>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      districtId: 0,
    },
  });

  const { data: cityData, isSuccess } = useGetCityByIdQuery(CityId, {
    skip: CityId === undefined,
  });

  useEffect(() => {
    if (isSuccess && cityData) {
      form.reset(cityData);
    }
  }, [isSuccess, cityData, form]);

  function onSubmit(values: City) {
    const updateData = {
      name: values.name,
      districtId: values.districtId,
    };
    updateCity({ id: CityId, data: updateData })
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        form.reset();
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to update city");
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
              <CommonHeader name={"Edit City"} />
            </DialogTitle>
            <DialogDescription>
              Update city information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-12 px-2 py-2">
            <div className="col-span-12">
              <Form {...form}>
                <form
                  id="city-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City Name*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the City Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      {/* <SelectPopover
                        label="District*"
                        placeholder="Select district..."
                        options={districts}
                        valueKey="id"
                        labelKey="name"
                        name="districtId"
                        control={form.control}
                        onValueChange={(selected) =>
                          handleDistrictChange(selected)
                        }
                        onSearchChange={handleSearchChange}
                      /> */}
                      <FormField
                        control={form.control}
                        name="districtId"
                        render={() => (
                          <FormItem>
                            <FormLabel>District*</FormLabel>
                            <FormControl>
                              <SelectPopover
                                label=""
                                placeholder="Select district..."
                                options={districts}
                                valueKey="id"
                                labelKey="name"
                                value={form.watch("districtId")}
                                hideLabel
                                onValueChange={(selected) =>
                                  handleDistrictChange(selected)
                                }
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
                        variant="outline"
                        className="m-1"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="m-1">
                        Update City
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
