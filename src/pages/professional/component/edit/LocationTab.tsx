import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { useGetStateQuery } from "../../../state/api/StateApi";
import { useGetDistrictsQuery } from "../../../district/api/DistrictApi";
import { useGetCitiesQuery } from "../../../city/api/CityApi";
import { useUpdateProfessionalMutation } from "../../api/ProfessionalApi";
import {
  updateProfessionalSchema,
  type UpdateProfessional,
  type Professional,
} from "../../schema-types/professional-schema";
import { useDebounce } from "@/helper/useDebounce";
import { PAGINATION_CONFIG } from "@/config/app.config";

interface LocationTabProps {
  professional: Professional;
}

export default function LocationTab({ professional }: LocationTabProps) {
  const professionalId = professional.id!;

  const [selectedStateId, setSelectedStateId] = useState<number | null>(
    professional.stateId || null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    professional.districtId || null
  );
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");

  const [updateProfessional, { isLoading }] = useUpdateProfessionalMutation();

  const debouncedStateSearch = useDebounce(stateSearchTerm, 300);
  const debouncedDistrictSearch = useDebounce(districtSearchTerm, 300);
  const debouncedCitySearch = useDebounce(citySearchTerm, 300);

  const { data: statesResponse } = useGetStateQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedStateSearch || undefined,
  });

  const states = useMemo(
    () =>
      (statesResponse?.data || [])
        .filter((s) => s.id !== undefined)
        .map((s) => ({
          id: s.id!,
          name: s.name,
        })),
    [statesResponse?.data]
  );

  const { data: districtsResponse } = useGetDistrictsQuery(
    {
      stateId: selectedStateId || undefined,
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      page: PAGINATION_CONFIG.DEFAULT_PAGE,
      sortBy: "name",
      sortOrder: "asc",
      name: debouncedDistrictSearch || undefined,
    },
    { skip: !selectedStateId }
  );

  const districts = useMemo(
    () =>
      (districtsResponse?.data || [])
        .filter((d) => d.id !== undefined)
        .map((d) => ({
          id: d.id!,
          name: d.name,
        })),
    [districtsResponse?.data]
  );

  const { data: citiesResponse } = useGetCitiesQuery(
    {
      districtId: selectedDistrictId || undefined,
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      page: PAGINATION_CONFIG.DEFAULT_PAGE,
      sortBy: "name",
      sortOrder: "asc",
      name: debouncedCitySearch || undefined,
    },
    { skip: !selectedDistrictId }
  );

  const cities = useMemo(
    () =>
      (citiesResponse?.data || [])
        .filter((c) => c.id !== undefined)
        .map((c) => ({
          id: c.id!,
          name: c.name,
        })),
    [citiesResponse?.data]
  );

  const form = useForm<UpdateProfessional>({
    resolver: zodResolver(updateProfessionalSchema),
    defaultValues: {
      id: professionalId,
      primaryPincode: professional.primaryPincode,
      country: professional.country || "India",
      latitude: professional.latitude,
      longitude: professional.longitude,
      stateId: professional.stateId,
      districtId: professional.districtId,
      cityId: professional.cityId,
    },
  });

  const stateId = form.watch("stateId");
  const districtId = form.watch("districtId");

  useEffect(() => {
    if (stateId) {
      setSelectedStateId(stateId);
    } else {
      setSelectedStateId(null);
      setSelectedDistrictId(null);
      form.setValue("districtId", undefined);
      form.setValue("cityId", undefined);
    }
  }, [stateId, form]);

  useEffect(() => {
    if (districtId) {
      setSelectedDistrictId(districtId);
    } else {
      setSelectedDistrictId(null);
      form.setValue("cityId", undefined);
    }
  }, [districtId, form]);

  const handleStateChange = (state: { id: number }) => {
    setSelectedStateId(state.id);
    form.setValue("stateId", state.id);
    form.setValue("districtId", undefined);
    form.setValue("cityId", undefined);
    setSelectedDistrictId(null);
  };

  const handleDistrictChange = (district: { id: number }) => {
    setSelectedDistrictId(district.id);
    form.setValue("districtId", district.id);
    form.setValue("cityId", undefined);
  };

  const handleSubmit = async (data: UpdateProfessional) => {
    try {
      await updateProfessional({
        id: professionalId,
        primaryPincode: data.primaryPincode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        stateId: data.stateId,
        districtId: data.districtId,
        cityId: data.cityId,
      }).unwrap();

      toast.success("Location information updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating location:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update location. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>
            Update the location details of the professional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectPopover
                  label="State"
                  placeholder="Select state..."
                  options={states}
                  valueKey="id"
                  labelKey="name"
                  name="stateId"
                  control={form.control}
                  // onValueChange={handleStateChange}
                  onSearchChange={setStateSearchTerm}
                />

                <SelectPopover
                  label="District"
                  placeholder="Select district..."
                  options={districts}
                  valueKey="id"
                  labelKey="name"
                  name="districtId"
                  control={form.control}
                  // onValueChange={handleDistrictChange}
                  onSearchChange={setDistrictSearchTerm}
                />

                <SelectPopover
                  label="City"
                  placeholder="Select city..."
                  options={cities}
                  valueKey="id"
                  labelKey="name"
                  name="cityId"
                  control={form.control}
                  onSearchChange={setCitySearchTerm}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                <FormField
                  control={form.control}
                  name="primaryPincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Pincode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{""}</FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="12.9716"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        For geo-location based search
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="77.5946"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        For geo-location based search
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
