import { type UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { SelectPopover } from "@/components/custom/CustomPopover2";
import ProfileImageUpload from "../../../../components/custom/ProfileImageUpload";
import { useGetCategoriesQuery } from "@/api/CategoryApi";
import { useGetStateQuery } from "@/pages/state/api/StateApi";
import { useGetDistrictsQuery } from "@/pages/district/api/DistrictApi";
import { useGetSubCategoriesByCategoryQuery } from "@/api/SubCategoryApi";
import type { ProfessionalSelectFallbacks } from "../../types/auth.types";
import type { Step1Registration } from "../../types/registration.types";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { ensureOptionInList, toIdNameOptions } from "@/utility/option-utils";

interface ProfessionalDetailsFormProps {
  form: UseFormReturn<Step1Registration>;
  isReviewMode?: boolean;
  /** Labels from saved API payload when options may not be on the current list page */
  selectOptionFallbacks?: ProfessionalSelectFallbacks;
}

export default function ProfessionalDetailsForm({
  form,
  isReviewMode = false,
  selectOptionFallbacks,
}: ProfessionalDetailsFormProps) {

  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");

  const stateId = form.watch("stateId");
  const districtId = form.watch("districtId");
  const categoryId = form.watch("categoryId");
  const subCategoryId = form.watch("subCategoryId");

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
    selectOptionFallbacks?.state &&
      Number(stateId) === selectOptionFallbacks.state.id
      ? selectOptionFallbacks.state
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
    selectOptionFallbacks?.district &&
      Number(districtId) === selectOptionFallbacks.district.id
      ? selectOptionFallbacks.district
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
    selectOptionFallbacks?.category &&
      Number(categoryId) === selectOptionFallbacks.category.id
      ? selectOptionFallbacks.category
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
    selectOptionFallbacks?.subCategory &&
      Number(subCategoryId) === selectOptionFallbacks.subCategory.id
      ? selectOptionFallbacks.subCategory
      : null;

  const subCategoryOptions = ensureOptionInList(
    baseSubCategoryOptions,
    fallbackSubCategory
  );
  // console.log("subCategoryOptions", subCategoryOptions);

  // const prevCategoryIdRef = useRef<number | undefined>(undefined);

  // useEffect(() => {
  //   const cid =
  //     categoryId != null && Number(categoryId) > 0
  //       ? Number(categoryId)
  //       : undefined;
  //   const prev = prevCategoryIdRef.current;
  //   prevCategoryIdRef.current = cid;

  //   if (prev !== undefined && prev > 0 && cid !== prev) {
  //     form.setValue("subCategoryId", 0);
  //   }
  // }, [categoryId, form]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...form.register("name")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mobile Number Field */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              placeholder="Enter your mobile number"
              {...form.register("mobileNumber")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
            />
            {form.formState.errors.mobileNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.mobileNumber.message}
              </p>
            )}
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input
              id="whatsappNumber"
              placeholder="Enter your WhatsApp number"
              {...form.register("whatsappNumber")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
            />
            {form.formState.errors.whatsappNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.whatsappNumber.message}
              </p>
            )}
          </div>

          {/* Referer Code Field */}
          {/* <div className="space-y-2">
            <Label htmlFor="refererCode">Referer Code (Optional)</Label>
            <Input
              id="refererCode"
              placeholder="Enter referer code if any"
              {...form.register("refererCode")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
            />
            {form.formState.errors.refererCode && (
              <p className="text-sm text-red-500">
                {form.formState.errors.refererCode.message}
              </p>
            )}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="cityName">City Name *</Label>
            <Input
              id="cityName"
              placeholder="Enter your city name"
              {...form.register("cityName")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
            />
            {form.formState.errors.cityName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.cityName.message}
              </p>
            )}
          </div>
        </div>

        {/* Category and SubCategory Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <SelectPopover
              label="Sub Category *"
              placeholder="Select your subcategory..."
              options={subCategoryOptions}
              valueKey="id"
              labelKey="name"
              name="subCategoryId"
              control={form.control}
              onSearchChange={setSubCategorySearch}
              disabled={!categoryId}
            />
          </div>
        </div>

        {/* State and District Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <SelectPopover
              label="District *"
              placeholder="Select your district..."
              options={districtOptions}
              valueKey="id"
              labelKey="name"
              name="districtId"
              control={form.control}
              onSearchChange={setDistrictSearch}
              disabled={!stateId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pincodes">Pincodes *</Label>
            <Input
              id="pincodes"
              placeholder="Enter pincodes (comma separated, max 5)"
              {...form.register("pincodes")}
              readOnly={isReviewMode}
              className={isReviewMode ? "bg-gray-50" : ""}
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

        {/* Profile Image Upload */}
        <div className="space-y-2">
          <ProfileImageUpload
            value={form.watch("profileImage")}
            onChange={(value: string) => form.setValue("profileImage", value)}
            error={form.formState.errors.profileImage?.message}
          />
        </div>
      </div>
    </Form>
  );
}
