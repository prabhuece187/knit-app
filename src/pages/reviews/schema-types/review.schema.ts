import { baseQuerySchema, type PaginationQueryType } from "@/schema-types/pagination-schema";
import { z } from "zod";

export const reviewStatusSchema = z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "COMPLETE",
]);

export const reviewProfessionalSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
});

export const reviewVisitorSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
});

export const reviewSchema = z.object({
    id: z.number(),
    message: z.string().nullish(),
    rating: z.number().int().min(1).max(5).nullish(),
    title: z.string().nullish(),

    serviceQuality: z.number().int().min(1).max(5).nullish(),
    communication: z.number().int().min(1).max(5).nullish(),

    status: reviewStatusSchema,
    isTestimonial: z.boolean(),
    isVerified: z.boolean(),

    moderatedBy: z.string().nullish(),
    moderatedAt: z.string().nullish(),
    moderationNotes: z.string().nullish(),

    visitorId: z.number().int().nullish(),
    professionalId: z.number().int(),

    professional: reviewProfessionalSchema.optional(),
    visitor: reviewVisitorSchema.nullish(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const reviewQuerySchema = baseQuerySchema.extend({
    professionalId: z.number().int().optional(),
    visitorId: z.number().int().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    status: reviewStatusSchema.optional(),
    isTestimonial: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    search: z.string().optional(),
    minServiceQuality: z.number().int().min(1).max(5).optional(),
    minCommunication: z.number().int().min(1).max(5).optional(),
});


export interface ReviewQueryType extends PaginationQueryType {
    professionalId?: number;
    visitorId?: number;
    rating?: number;
    status?: ReviewStatus;
    isTestimonial?: boolean;
    isVerified?: boolean;
    search?: string;
    minServiceQuality?: number;
    minCommunication?: number;
}

export type ReviewQuery = z.infer<typeof reviewQuerySchema>;