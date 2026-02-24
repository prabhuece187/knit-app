// ======================= Pagination Configuration ============================

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_SORT_BY: "createdAt",
  DEFAULT_SORT_ORDER: "desc" as const,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
  MAX_LIMIT: 100,
} as const;
