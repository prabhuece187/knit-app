import { useState, useMemo, useEffect, useCallback } from "react";
import { usePagination } from "./usePagination";
import type { PaginationMeta } from "@/schema-types/pagination-schema";
import { useDebounce } from "@/helper/useDebounce";

export interface UseDataTableProps<
  TQuery extends Record<string, unknown>,
  TItem,
> {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilters?: Record<string, string>;
  searchField?: string;
  fetchData?: (
    params: TQuery,
    signal?: AbortSignal,
  ) => Promise<{ data: TItem[]; meta: PaginationMeta }>;
}

export function useDataTable<TQuery extends Record<string, unknown>, TItem>({
  initialPage,
  initialLimit = 10,
  initialSortBy,
  initialSortOrder,
  initialFilters = {},
  searchField = "search",
  fetchData,
}: UseDataTableProps<TQuery, TItem>) {
  const { pagination, setPage, setLimit, setSorting, updatePaginationMeta } =
    usePagination({
      initialPage,
      initialLimit,
      initialSortBy,
      initialSortOrder,
    });

  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);

  // -----------------------
  // Build query params
  // -----------------------
  const queryParams = useMemo<TQuery>(() => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== "" && value != null,
      ),
    ) as Record<string, unknown>;

    return {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      ...(searchTerm ? { [searchField]: searchTerm } : {}),
      ...cleanedFilters,
    } as unknown as TQuery;
  }, [
    pagination.page,
    pagination.limit,
    pagination.sortBy,
    pagination.sortOrder,
    filters,
    searchTerm,
    searchField,
  ]);

  // -----------------------
  // Debounce queryParams to avoid spamming
  // -----------------------
  const debouncedQueryParams = useDebounce(queryParams, 300);

  // -----------------------
  // Fetch data with AbortController
  // -----------------------
  useEffect(() => {
    if (!fetchData) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetchData(debouncedQueryParams, signal)
      .then((result) => {
        if (!signal.aborted) {
          setData(result.data);

          // Update pagination meta safely
          updatePaginationMeta(result.meta);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError")
          console.error(err);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // DO NOT include `pagination` in dependencies — avoids loop
  }, [debouncedQueryParams, fetchData, updatePaginationMeta]);

  // -----------------------
  // Handlers
  // -----------------------
  const handlePageChange = useCallback(
    (page: number) => setPage(page),
    [setPage],
  );

  const handleLimitChange = useCallback(
    (limit: number) => setLimit(limit),
    [setLimit],
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") =>
      setSorting(sortBy, sortOrder),
    [setSorting],
  );

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPage(1); // reset page when search changes
    },
    [setPage],
  );

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      setFilters(newFilters);
      setPage(1); // reset page when filters change
    },
    [setPage],
  );

  return {
    data,
    loading,
    pagination,
    queryParams: debouncedQueryParams,
    filters,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    handleFilterChange,
    updatePaginationMeta,
  };
}
