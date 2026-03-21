import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  slug: z.string(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type Category = z.infer<typeof categorySchema>;

// SubCategory Schema
export const subCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  categoryId: z.number(),
});

export type SubCategory = z.infer<typeof subCategorySchema>;

// Step 1 Registration Schema
export const step1RegistrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  categoryId: z.coerce.number().min(1, "Please select a category"),
  subCategoryId: z.coerce.number().min(1, "Please select a subcategory"),
  profileImage: z.string().optional(),
  refererCode: z.string().optional(),
  stateId: z.coerce.number().min(1, "Please select a state"),
  districtId: z.coerce.number().min(1, "Please select a district"),
  cityName: z.string().optional(),
  // schema
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
});

export type Step1Registration = z.input<typeof step1RegistrationSchema>;

// Step 2 Registration Schema
export const step2RegistrationSchema = z.object({
  language: z.string().min(1, "Please select your language"),
  surveySource: z.string().optional(),
});

export type Step2Registration = z.infer<typeof step2RegistrationSchema>;

// Complete Registration Schema
export const completeRegistrationSchema = step1RegistrationSchema.merge(
  step2RegistrationSchema
);

export type CompleteRegistration = z.infer<typeof completeRegistrationSchema>;

// Language Options
export const languageOptions = [
  { id: 1, name: "English", code: "en" },
  { id: 2, name: "Hindi", code: "hi" },
  { id: 3, name: "Tamil", code: "ta" },
  { id: 4, name: "Telugu", code: "te" },
  { id: 5, name: "Bengali", code: "bn" },
  { id: 6, name: "Gujarati", code: "gu" },
  { id: 7, name: "Marathi", code: "mr" },
  { id: 8, name: "Kannada", code: "kn" },
  { id: 9, name: "Malayalam", code: "ml" },
  { id: 10, name: "Punjabi", code: "pa" },
];

// Survey Source Options
export const surveySourceOptions = [
  { id: 1, name: "Google Search", value: "google_search" },
  { id: 2, name: "Social Media", value: "social_media" },
  { id: 3, name: "Friend/Family", value: "friend_family" },
  { id: 4, name: "Advertisement", value: "advertisement" },
  { id: 5, name: "Referral", value: "referral" },
  { id: 6, name: "Other", value: "other" },
];
