import { useState, useCallback } from "react";
import { PAGINATION_CONFIG } from "@/config/app.config";
import type {
  PaginationState,
  PaginationMeta,
  UsePaginationReturn,
} from "@/schema-types/pagination-schema";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

export function usePagination({
  initialPage = PAGINATION_CONFIG.DEFAULT_PAGE,
  initialLimit = PAGINATION_CONFIG.DEFAULT_LIMIT,
  initialSortBy = PAGINATION_CONFIG.DEFAULT_SORT_BY,
  initialSortOrder = PAGINATION_CONFIG.DEFAULT_SORT_ORDER,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pages: [],
  });

  const setPage = useCallback(
    (page: number) => setPagination((prev) => ({ ...prev, page })),
    [],
  );
  const setLimit = useCallback(
    (limit: number) => setPagination((prev) => ({ ...prev, limit, page: 1 })),
    [],
  );
  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") =>
      setPagination((prev) => ({ ...prev, sortBy, sortOrder, page: 1 })),
    [],
  );

  const resetPagination = useCallback(() => {
    setPagination({
      page: initialPage,
      limit: initialLimit,
      sortBy: initialSortBy,
      sortOrder: initialSortOrder,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
      pages: [],
    });
  }, [initialPage, initialLimit, initialSortBy, initialSortOrder]);

  const updatePaginationMeta = useCallback((meta: PaginationMeta) => {
    setPagination((prev) => ({
      ...prev,
      total: meta.total,
      totalPages: meta.totalPages,
      hasNext: meta.hasNext,
      hasPrev: meta.hasPrev,
      pages: meta.pages ?? [],
    }));
  }, []);

  return {
    pagination,
    setPage,
    setLimit,
    setSorting,
    resetPagination,
    updatePaginationMeta,
  };
}
