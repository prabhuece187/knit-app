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
