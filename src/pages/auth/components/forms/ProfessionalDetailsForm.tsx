import { type UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { SelectPopover } from "@/components/custom/CustomPopover";
import ProfileImageUpload from "../../../../components/custom/ProfileImageUpload";
import { useGetActiveCategoriesQuery } from "@/api/CategoryApi";
import { useGetSubCategoriesByCategoryQuery } from "@/api/SubCategoryApi";
import {
  type Step1Registration,
  type SubCategory,
} from "../../types/registration.types";

interface ProfessionalDetailsFormProps {
  form: UseFormReturn<Step1Registration>;
  isReviewMode?: boolean;
}

export default function ProfessionalDetailsForm({
  form,
  isReviewMode = false,
}: ProfessionalDetailsFormProps) {
  const categoryId = form.watch("categoryId");

  const { data: categories = [] } = useGetActiveCategoriesQuery();
  const { data: subCategories = [] } = useGetSubCategoriesByCategoryQuery(
    categoryId || 0,
    { skip: !categoryId }
  );

  // React to category change (SelectPopover updates form via Controller; we sync subcategory here)
  useEffect(() => {
    if (categoryId) {
      form.setValue("subCategoryId", 0);
    }
  }, [categoryId, form]);

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
          <div className="space-y-2">
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
          </div>
        </div>

        {/* Category and SubCategory Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <SelectPopover
              label="Category *"
              placeholder="Select your category..."
              options={categories}
              valueKey="id"
              labelKey="name"
              name="categoryId"
              control={form.control}
            />
            {form.formState.errors.categoryId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <SelectPopover
              label="Sub Category *"
              placeholder="Select your subcategory..."
              options={subCategories as SubCategory[]}
              valueKey="id"
              labelKey="name"
              name="subCategoryId"
              control={form.control}
            />
            {form.formState.errors.subCategoryId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.subCategoryId.message}
              </p>
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
