import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { SelectPopover } from "@/components/custom/CustomPopover2";
import ProfileImageUpload from "@/components/custom/ProfileImageUpload";
import { useGetCategoriesQuery } from "@/api/CategoryApi";
import { useGetSubCategoriesByCategoryQuery } from "@/api/SubCategoryApi";
import { useCreateProfessionalMutation } from "../../api/ProfessionalApi";
import {
    type CreateProfessional,
} from "../../schema-types/professional-schema";
import type { CompleteRegistration } from "@/schema-types/master-schema";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { toIdNameOptions } from "@/utility/option-utils";

interface BasicInfoTabProps {
    registrationData?: CompleteRegistration;
}

interface BasicInfoTabProps {
    registrationData?: CompleteRegistration;
}

export default function BasicInfoTab({ registrationData }: BasicInfoTabProps) {
    const navigate = useNavigate();

    const [createProfessional, { isLoading }] = useCreateProfessionalMutation();

    const [categorySearch, setCategorySearch] = useState("");
    const [subCategorySearch, setSubCategorySearch] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        registrationData?.categoryId || null
    );

    const debouncedCategorySearch = useDebounce(categorySearch, 300);
    const debouncedSubCategorySearch = useDebounce(subCategorySearch, 300);

    const { data: categories } = useGetCategoriesQuery({
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
        sortBy: "name",
        sortOrder: "asc",
        name: debouncedCategorySearch || undefined,
    });

    const { data: subCategories } = useGetSubCategoriesByCategoryQuery(
        {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
            sortBy: "name",
            sortOrder: "asc",
            name: debouncedSubCategorySearch || undefined,
            categoryId: Number(selectedCategoryId),
        },
        { skip: !selectedCategoryId }
    );

    const form = useForm<CreateProfessional>({
        // resolver: zodResolver(createProfessionalSchema),
        // defaultValues: {
        //     userId: user?.id || 0,
        //     name: registrationData?.name || "",
        //     slug: "",
        //     profileImage: registrationData?.profileImage || "",
        //     officeName: "",
        //     // autoBiography: "",
        //     // experience: "",
        //     categoryId: registrationData?.categoryId,
        //     subCategoryId: registrationData?.subCategoryId,
        // },
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

    const handleSubmit = async (data: CreateProfessional) => {
        try {
            const result = await createProfessional(data).unwrap();
            toast.success("Professional created successfully!");

            if (result.data?.id) {
                navigate(`/professionals/${result.data.id}/edit`);
            } else {
                navigate("/professionals");
            }
        } catch (error: any) {
            console.error("Error creating professional:", error);
            toast.error(
                error?.data?.message ||
                "Failed to create professional. Please try again."
            );
        }
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="professional-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        URL-friendly version of the name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="officeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter office name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    <SelectPopover
                        label="Category *"
                        placeholder="Select your category..."
                        options={toIdNameOptions(categories?.data)}
                        valueKey="id"
                        labelKey="name"
                        name="categoryId"
                        control={form.control}
                        onSearchChange={setCategorySearch}
                    />

                    <SelectPopover
                        label="Sub Category *"
                        placeholder="Select your subcategory..."
                        options={toIdNameOptions(subCategories?.data)}
                        valueKey="id"
                        labelKey="name"
                        name="subCategoryId"
                        control={form.control}
                        onSearchChange={setSubCategorySearch}
                    />

                    <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProfileImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={form.formState.errors.profileImage?.message}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "Creating..." : "Create Professional"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
