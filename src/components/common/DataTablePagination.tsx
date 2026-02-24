import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import type { PaginationMeta } from "@/schema-types/pagination-schema";
import { PAGINATION_CONFIG } from "@/config/app.config";

interface DataTablePaginationProps {
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataTablePagination({
  meta,
  onPageChange,
  onLimitChange,
}: DataTablePaginationProps) {
  // ✅ Guard: pagination not available
  if (!meta) return null;

  const { page, totalPages, hasNext, hasPrev, total, limit, pages } = meta;

  const handlePageChange = (newPage: number) => {
    if (!onPageChange) return;
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    if (!onLimitChange) return;
    onLimitChange(parseInt(newLimit, 10));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-2 py-4 space-y-2 md:space-y-0">
      <div className="text-sm text-muted-foreground">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
        {total} results
      </div>

      <div className="flex items-center space-x-6">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGINATION_CONFIG.PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(1)}
            disabled={!hasPrev}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages?.map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNext}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-medium">
          Page {page} of {totalPages}
        </div>
      </div>
    </div>
  );
}
