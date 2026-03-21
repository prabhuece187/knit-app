import type { PaginationQueryType } from "@/schema-types/pagination-schema";
import { z } from "zod";

export const stateSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, {
        message: "Please Enter the State Name.",
    }),
    stateCode: z.string().min(2, {
        message: "Please Enter the State Code",
    }),
    type: z.enum(["STATE", "UNION_TERRITORY"]),
});

export type State = z.infer<typeof stateSchema>;

export const stateQuerySchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    name: z.string().optional(),
    stateCode: z.string().optional(),
});

export interface StateQueryType extends PaginationQueryType {
    name?: string;
    stateCode?: string;
};


export type StateQuery = z.infer<typeof stateQuerySchema>;