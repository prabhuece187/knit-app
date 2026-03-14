import { z } from "zod";
// ================= Pagination Types =====================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  pages: number[];
}

export interface PaginationState extends PaginationMeta {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  resetPagination: () => void;
  updatePaginationMeta: (meta: PaginationMeta) => void;
}


// ======================= Common Response Types ============================

// Success response schema (matches backend SuccessDto)
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;

// Create response schema (for POST operations)
export const createResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export type CreateResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Update response schema (for PATCH/PUT operations)
export const updateResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export type UpdateResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Delete response schema (for DELETE operations)
export const deleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type DeleteResponse = z.infer<typeof deleteResponseSchema>;