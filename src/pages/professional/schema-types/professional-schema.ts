import { categorySchema, subCategorySchema } from "@/pages/auth/types/registration.types";
import { citySchema } from "@/pages/city/schema-types/city-schema";
import { districtSchema } from "@/pages/district/schema-types/district-schema";
import { stateSchema } from "@/pages/state/schema-types/state.schema";
import z from "zod";

// Business hours schema for JSON validation
export const businessHoursSchema = z.object({
    monday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    tuesday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    wednesday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    thursday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    friday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    saturday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
    sunday: z
        .object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        })
        .optional(),
});

// Known languages schema for JSON validation
export const knownLanguagesSchema = z.array(
    z.object({
        language: z.string().min(1, "Language name is required"),
        proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Native"], {
            errorMap: () => ({ message: "Please select a valid proficiency level" }),
        }),
    })
);

// Main Professional schema
export const professionalSchema = z.object({
    id: z.coerce.number().optional(),
    userId: z.coerce.number().min(1, { message: "User ID is required" }),
    name: z
        .string()
        .min(2, { message: "Professional name must be at least 2 characters" }),

    profileImage: z.string().optional(),
    // knownLanguages: knownLanguagesSchema.optional(),
    // qualifications: z.array(z.string()).optional(),
    // certifications: z.array(z.string()).optional(),
    // specializations: z.array(z.string()).optional(),

    // SEO and social fields
    slug: z
        .string()
        .min(1, { message: "Slug is required" })
        .regex(
            /^[a-z0-9-]+$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        )
        .optional()
        .nullable(),
    // metaTitle: z.string().optional(),
    // metaDescription: z
    //     .string()
    //     .max(160, "Meta description must be less than 160 characters")
    //     .optional(),
    // metaKeywords: z.array(z.string()).optional(),
    // ogImage: z.string().url("Please enter a valid OG image URL").optional(),
    // canonicalUrl: z.string().url("Please enter a valid canonical URL").optional(),

    // Professional details
    officeName: z.string().optional().nullable(),
    officeWebsite: z.string().url("Please enter a valid website URL").optional(),
    linkedInProfile: z
        .string()
        .url("Please enter a valid LinkedIn profile URL")
        .optional(),
    twitterProfile: z
        .string()
        .url("Please enter a valid Twitter profile URL")
        .optional(),
    facebookProfile: z
        .string()
        .url("Please enter a valid Facebook profile URL")
        .optional(),
    instagramProfile: z
        .string()
        .url("Please enter a valid Instagram profile URL")
        .optional(),

    // Location details
    primaryPincode: z
        .string()
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits")
        .optional(),

    // Category and subcategory
    categoryId: z.coerce.number().min(1, "Please select a category"),
    subCategoryId: z.coerce.number().min(1, "Please select a subcategory"),

    stateId: z.coerce.number().min(1, "Please select a state"),
    districtId: z.coerce.number().min(1, "Please select a district"),
    cityName: z.string().optional(),

    country: z.string().default("India"),
    latitude: z.coerce
        .number()
        .min(-90)
        .max(90, "Latitude must be between -90 and 90")
        .optional(),
    longitude: z.coerce
        .number()
        .min(-180)
        .max(180, "Longitude must be between -180 and 180")
        .optional(),

    // Professional status and metrics
    isVerified: z.boolean().default(false),
    isPremiumListed: z.boolean().default(false),
    averageRating: z.coerce
        .number()
        .min(0)
        .max(5, "Rating must be between 0 and 5")
        .default(0),
    totalReviews: z.coerce
        .number()
        .min(0, "Total reviews cannot be negative")
        .default(0),

    // Business hours
    businessHours: businessHoursSchema.optional(),

    pincodes: z.preprocess(
        (val) => {
            // RHF passes a string from the input
            if (typeof val === "string") {
                return val
                    .split(",")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0);
            }
            // already an array (e.g. default values)
            if (Array.isArray(val)) return val;
            return [];
        },
        z
            .array(
                z.string().superRefine((val, ctx) => {
                    if (val.length !== 6) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `"${val}" must be exactly 6 digits`,
                        });
                    } else if (!/^\d{6}$/.test(val)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `"${val}" must contain digits only`,
                        });
                    }
                })
            )
            .min(1, "At least one pincode is required")
            .max(5, "You can provide up to 5 pincodes")
            .superRefine((pincodes, ctx) => {
                const seen = new Set<string>();
                pincodes.forEach((pin, index) => {
                    if (seen.has(pin)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `"${pin}" is duplicated`,
                            path: [index],
                        });
                    }
                    seen.add(pin);
                });
            })
    ),

    // Timestamps
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const professionalResponseSchema = professionalSchema.extend({
    category: categorySchema.optional().nullable(),
    subCategory: subCategorySchema.optional().nullable(),
    state: stateSchema.optional().nullable(),
    district: districtSchema.optional().nullable(),
    city: citySchema.optional().nullable(),
    pincodes: z.array(z.string()).optional(),
});

export type ProfessionalResponse = z.infer<typeof professionalResponseSchema>;

// Create Professional schema (without id and timestamps)
export const createProfessionalSchema = professionalSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

/**
 * react-hook-form often yields `null` (cleared SelectPopover, image field, etc.).
 * Zod `.optional()` allows undefined but rejects null, so validation would fail
 * without normalizing.
 */
const nullFormValuesToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => {
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            return Object.fromEntries(
                Object.entries(val as Record<string, unknown>).map(([k, v]) => [
                    k,
                    v === null ? undefined : v,
                ])
            );
        }
        return val;
    }, schema);


export const updateProfessionalSchema =
    professionalSchema.partial().required({
        id: true,
    });

// Update Professional schema (all fields optional except id)
// export const updateProfessionalSchema = nullFormValuesToUndefined(
//     professionalSchema.partial().required({
//         id: true,
//     })
// );

// Professional query parameters schema
export const professionalQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    name: z.string().optional(),
    categoryId: z.coerce.number().optional(),
    subCategoryId: z.coerce.number().optional(),
    stateId: z.coerce.number().optional(),
    districtId: z.coerce.number().optional(),
    cityId: z.coerce.number().optional(),
    pincode: z.string().optional(),
    isVerified: z.coerce.boolean().optional(),
    isPremiumListed: z.coerce.boolean().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    specializations: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    search: z.string().optional(),
});

// Premium status update schema
export const premiumStatusSchema = z.object({
    isPremium: z.boolean(),
});

// Professional verification schema
export const professionalVerificationSchema = z.object({
    isVerified: z.boolean(),
    verificationNotes: z.string().optional(),
});

// Type exports
export type Professional = z.infer<typeof professionalSchema>;
export type CreateProfessional = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessional = z.infer<typeof updateProfessionalSchema>;
/** Form values match Zod *input* (see `zodResolver`); differs from output when fields use `z.preprocess`. */
export type UpdateProfessionalInput = z.input<typeof updateProfessionalSchema>;
export type ProfessionalQuery = z.infer<typeof professionalQuerySchema>;
export type PremiumStatus = z.infer<typeof premiumStatusSchema>;
export type ProfessionalVerification = z.infer<
    typeof professionalVerificationSchema
>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;
export type KnownLanguages = z.infer<typeof knownLanguagesSchema>;
