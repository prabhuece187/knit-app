import type { PaginationQueryType } from "@/schema-types/pagination-schema";
import { z } from "zod";

/** Mirrors Prisma `FaqCategory` / backend `FaqCategory` */
export const faqCategorySchema = z.enum(["PROFESSIONAL", "VISITOR"]);
export type FaqCategory = z.infer<typeof faqCategorySchema>;

/** Entity shape aligned with `FaqResponseDto` */
export const faqSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  category: faqCategorySchema,
  isPublic: z.boolean(),
  sortOrder: z.number(),
  slug: z.string(),
  metaTitle: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Faq = z.infer<typeof faqSchema>;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Aligned with `CreateFaqDto` */
export const createFaqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500),
  answer: z.string().min(10, "Answer must be at least 10 characters").max(5000),
  category: faqCategorySchema,
  isPublic: z.boolean(),
  sortOrder: z.number().int().min(0),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(slugRegex, {
      message:
        'Slug must be lowercase, alphanumeric with hyphens only (e.g. "how-to-register")',
    }),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
});

export type CreateFaqFormValues = z.infer<typeof createFaqSchema>;

export const editFaqSchema = createFaqSchema;
export type EditFaqFormValues = z.infer<typeof editFaqSchema>;

export type CreateFaqPayload = {
  question: string;
  answer: string;
  category: FaqCategory;
  isPublic?: boolean;
  sortOrder?: number;
  slug: string;
  metaTitle?: string;
};

export type UpdateFaqPayload = Partial<Omit<CreateFaqPayload, "metaTitle">> & {
  metaTitle?: string | null;
};

/** List query params aligned with `FaqQueryDto` + pagination (`question` for text filter). */
export interface FaqQueryParams extends PaginationQueryType {
  question?: string;
  category?: FaqCategory | string;
  isPublic?: boolean | string;
  [key: string]: unknown;
}
