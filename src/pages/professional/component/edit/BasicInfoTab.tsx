import { useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover2";
import ProfileImageUpload from "@/components/custom/ProfileImageUpload";
import { useGetCategoriesQuery } from "@/api/CategoryApi";
import { useGetSubCategoriesByCategoryQuery } from "@/api/SubCategoryApi";
import { useUpdateProfessionalMutation } from "../../api/ProfessionalApi";
import {
  updateProfessionalSchema,
  type UpdateProfessional,
  type UpdateProfessionalInput,
  type ProfessionalResponse,
} from "../../schema-types/professional-schema";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { toIdNameOptions, ensureOptionInList } from "@/utility/option-utils";
import { useDebounce } from "@/helper/useDebounce";
import { useGetStateQuery } from "@/pages/state/api/StateApi";
import { useGetDistrictsQuery } from "@/pages/district/api/DistrictApi";
import { Label } from "@/components/ui/label";

interface BasicInfoTabProps {
  professional: ProfessionalResponse;
}

export default function BasicInfoTab({ professional }: BasicInfoTabProps) {

  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");

  const [updateProfessional, { isLoading }] = useUpdateProfessionalMutation();

  const stateId = professional.stateId;
  const districtId = professional.districtId;
  const categoryId = professional.categoryId;
  const subCategoryId = professional.subCategoryId;

  const debouncedStateSearch = useDebounce(stateSearch, 300);
  const debouncedDistrictSearch = useDebounce(districtSearch, 300);
  const debouncedCategorySearch = useDebounce(categorySearch, 300);
  const debouncedSubCategorySearch = useDebounce(subCategorySearch, 300);

  // Use paginated states query with debounced search
  const { data: statesResponse } = useGetStateQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedStateSearch || undefined,
  });

  const baseStates = toIdNameOptions(statesResponse?.data);
  const fallbackState =
    stateId &&
      professional.state
      ? { id: stateId, name: professional.state.name }
      : null;
  const stateOptions = ensureOptionInList(baseStates, fallbackState);

  const { data: districtsResponse } = useGetDistrictsQuery(
    {
      page: PAGINATION_CONFIG.DEFAULT_PAGE,
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      sortBy: "name",
      sortOrder: "asc",
      name: debouncedDistrictSearch || undefined,
      stateId: stateId ? Number(stateId) : undefined,
    },
    { skip: !stateId }
  );

  const baseDistricts = toIdNameOptions(districtsResponse?.data);

  const fallbackDistrict =
    districtId &&
      professional.district
      ? { id: districtId, name: professional.district.name }
      : null;
  const districtOptions = ensureOptionInList(baseDistricts, fallbackDistrict);

  const { data: categories } = useGetCategoriesQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedCategorySearch || undefined,
  });

  const baseCategoryOptions = toIdNameOptions(categories?.data);

  const fallbackCategory =
    categoryId &&
      professional.category
      ? { id: categoryId, name: professional.category.name }
      : null;

  const categoryOptions = ensureOptionInList(
    baseCategoryOptions,
    fallbackCategory
  );

  const { data: subCategories } = useGetSubCategoriesByCategoryQuery(
    {
      page: PAGINATION_CONFIG.DEFAULT_PAGE,
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      sortBy: "name",
      sortOrder: "asc",
      name: debouncedSubCategorySearch || undefined,
      categoryId: Number(categoryId),
    },
    { skip: !categoryId }
  );

  const baseSubCategoryOptions = toIdNameOptions(subCategories?.data);

  const fallbackSubCategory =
    subCategoryId &&
      professional.subCategory
      ? { id: subCategoryId, name: professional.subCategory.name }
      : null;

  const subCategoryOptions = ensureOptionInList(
    baseSubCategoryOptions,
    fallbackSubCategory
  );

  const form = useForm<UpdateProfessionalInput, unknown, UpdateProfessional>({
    resolver: zodResolver(updateProfessionalSchema),
    defaultValues: {
      id: professional.id,
      name: professional.name,
      slug: professional.slug,
      officeName: professional.officeName,
      categoryId: professional.categoryId,
      subCategoryId: professional.subCategoryId,
      stateId: professional.stateId,
      districtId: professional.districtId,
      cityName: professional.city?.name,
      profileImage: professional.profileImage ?? undefined,
      pincodes: professional.pincodes,
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!form.getValues("slug") || form.getValues("slug") === "") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  };

  const handleSubmit = async (data: UpdateProfessional) => {

    console.log("data", data);
    if (!professional.id) {
      toast.error("Invalid professional ID");
      return;
    }

    try {
      await updateProfessional({
        id: professional.id,
        name: data.name,
        slug: data.slug,
        profileImage: data.profileImage || "",
        officeName: data.officeName,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        stateId: data.stateId,
        districtId: data.districtId,
        cityName: data.cityName,
        pincodes: data.pincodes,
      }).unwrap();

      toast.success("Basic information updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating professional:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update basic information. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update the basic details of the professional profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-8 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter professional name"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleNameChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <SelectPopover
                    label="Category *"
                    placeholder="Select your category..."
                    options={categoryOptions}
                    valueKey="id"
                    labelKey="name"
                    name="categoryId"
                    control={form.control}
                    onSearchChange={setCategorySearch}
                  />

                  <SelectPopover
                    label="Sub Category *"
                    placeholder="Select your subcategory..."
                    options={subCategoryOptions}
                    valueKey="id"
                    labelKey="name"
                    name="subCategoryId"
                    control={form.control}
                    onSearchChange={setSubCategorySearch}
                  />

                  <SelectPopover
                    label="State *"
                    placeholder="Select your state..."
                    options={stateOptions}
                    valueKey="id"
                    labelKey="name"
                    name="stateId"
                    control={form.control}
                    onSearchChange={setStateSearch}
                  />

                  <SelectPopover
                    label="District *"
                    placeholder="Select your district..."
                    options={districtOptions}
                    valueKey="id"
                    labelKey="name"
                    name="districtId"
                    control={form.control}
                    onSearchChange={setDistrictSearch}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="cityName">City Name *</Label>
                    <Input
                      id="cityName"
                      placeholder="Enter your city name"
                      {...form.register("cityName")}
                    />
                    {form.formState.errors.cityName && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.cityName.message}
                      </p>
                    )}
                  </div>

                  {/* <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="professional-slug"
                            {...field}
                            className="col-span-2"
                          />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProfileImageUpload
                            value={field.value ?? undefined}
                            onChange={(value) => field.onChange(value ?? null)}
                            error={form.formState.errors.profileImage?.message}
                            className="col-span-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-12 md:col-span-4">

                  <Label htmlFor="pincodes">Pincodes *</Label>
                  <Input
                    id="pincodes"
                    placeholder="Enter pincodes (comma separated, max 5)"
                    {...form.register("pincodes")}
                  />

                  {/* array-level errors — min/max */}
                  {form.formState.errors.pincodes?.root?.message && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.pincodes.root.message}
                    </p>
                  )}

                  {/* root message — when pincodes is not an array error */}
                  {form.formState.errors.pincodes?.message && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.pincodes.message}
                    </p>
                  )}

                  {/* per-item errors — invalid/duplicate pincodes */}
                  {Array.isArray(form.formState.errors.pincodes) &&
                    form.formState.errors.pincodes.map((err, i) =>
                      err?.message ? (
                        <p key={i} className="text-sm text-red-500">
                          {err.message}
                        </p>
                      ) : null
                    )}
                </div>


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
