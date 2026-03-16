import { z } from "zod";

// ======================= City Schema ============================

export const citySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: "Please Enter the City Name.",
  }),
  districtId: z.number({
    required_error: "Please select a District",
  }),
  district: z
    .object({
      id: z.number(),
      name: z.string(),
      districtCode: z.string().optional(),
      stateId: z.number(),
      state: z
        .object({
          id: z.number(),
          name: z.string(),
          stateCode: z.string(),
        })
        .optional(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type City = z.infer<typeof citySchema>;

// ======================= City Query Schema ============================

// City-specific query schema (extends pagination options)
export const cityQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  name: z.string().optional(),
  districtId: z.number().optional(),
  stateId: z.number().optional(),
});

export type CityQuery = z.infer<typeof cityQuerySchema>;

// ======================== City Filter Schema ============================
export interface CityFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export const cityFilterSchema = z.object({
  districtId: z.number().optional(),
  stateId: z.number().optional(),
});

export type CityFilterFormData = z.infer<typeof cityFilterSchema>;
