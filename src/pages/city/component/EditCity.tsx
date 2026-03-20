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
import { useUpdateCityMutation } from "../api/CityApi";
import { useGetDistrictsQuery } from "@/pages/district/api/DistrictApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import CommonHeader from "@/components/common/CommonHeader";
import { SelectPopover } from "@/components/custom/CustomPopover2";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { ensureOptionInList } from "@/utility/option-utils";
import { toIdNameOptions } from "@/utility/option-utils";


export default function EditCity({
  open,
  setOpen,
  city,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  city: City;
}) {
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [updateCity] = useUpdateCityMutation();

  const debouncedSearchTerm = useDebounce(districtSearchTerm, 300);

  const { data: districtsResponse } = useGetDistrictsQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedSearchTerm || undefined,
  });

  const baseDistricts = toIdNameOptions(districtsResponse?.data);


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

  const fallbackDistrict =
    city?.districtId &&
      city?.district
      ? { id: city.districtId, name: city.district.name }
      : null;

  const districts = ensureOptionInList(baseDistricts, fallbackDistrict);


  const handleSearchChange = (searchTerm: string) => {
    setDistrictSearchTerm(searchTerm);
  };

  useEffect(() => {
    if (city?.id) {
      form.reset(city);
    }
  }, [city]);

  function onSubmit(values: City) {
    const updateData = {
      name: values.name,
      districtId: values.districtId,
    };
    updateCity({ id: city.id as number, data: updateData })
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

  const handleClose = (value: boolean) => {
    if (!value) form.reset();
    setDistrictSearchTerm("")
    setOpen(value)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
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
                      <SelectPopover
                        label="District*"
                        placeholder="Select district..."
                        options={districts}
                        valueKey="id"
                        labelKey="name"
                        name="districtId"
                        control={form.control}
                        onValueChange={(selected) =>
                          handleDistrictChange(
                            selected?.id ? Number(selected.id) : undefined
                          )
                        }
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
