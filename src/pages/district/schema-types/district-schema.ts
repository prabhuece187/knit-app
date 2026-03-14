import { z } from "zod";

// ======================= District Schema ============================

export const districtSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: "Please Enter the District Name.",
  }),
  districtCode: z.string().min(2, {
    message: "Please Enter the District Code",
  }),
  stateId: z.number({
    required_error: "Please select a State",
  }),
  state: z
    .object({
      name: z.string(),
      stateCode: z.string(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type District = z.infer<typeof districtSchema>;

// ======================= District Query Schema ============================

// District-specific query schema (extends pagination options)
export const districtQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  name: z.string().optional(),
  districtCode: z.string().optional(),
  stateId: z.number().optional(),
});

export type DistrictQuery = z.infer<typeof districtQuerySchema>;

// ======================== District Filter Schema ============================
export interface DistrictFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export const districtFilterSchema = z.object({
  stateId: z.number().optional(),
});

export type DistrictFilterFormData = z.infer<typeof districtFilterSchema>;
