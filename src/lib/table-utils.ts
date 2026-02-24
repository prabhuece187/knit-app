import type { CSSProperties } from "react";

/**
 * Fixed columns configuration interface
 */
export interface FixedColumnsConfig {
  left?: string[];
  right?: string[];
}

/**
 * Get column style for fixed columns (sticky positioning)
 * @param columnId - The column identifier
 * @param fixedColumns - Configuration for fixed columns
 * @returns CSS properties object for the column
 */
export function getColumnStyle(
  columnId: string,
  fixedColumns?: FixedColumnsConfig,
): CSSProperties {
  if (!fixedColumns) return {};

  const isLeftFixed = fixedColumns.left?.includes(columnId);
  const isRightFixed = fixedColumns.right?.includes(columnId);

  if (isLeftFixed) {
    return {
      position: "sticky",
      left: 0,
      zIndex: 10,
      backgroundColor: "hsl(var(--background))",
      borderRight: "1px solid hsl(var(--border))",
    };
  }

  if (isRightFixed) {
    return {
      position: "sticky",
      right: 0,
      zIndex: 10,
      backgroundColor: "hsl(var(--background))",
      borderLeft: "1px solid hsl(var(--border))",
    };
  }

  return {};
}

/**
 * Create a memoized column style getter function
 * This is useful when you need to call getColumnStyle multiple times in a render
 * @param fixedColumns - Configuration for fixed columns
 * @returns A memoized function that gets column styles
 */
export function createColumnStyleGetter(fixedColumns?: FixedColumnsConfig) {
  const cache = new Map<string, CSSProperties>();

  return (columnId: string): CSSProperties => {
    if (!fixedColumns) return {};

    // Check cache first
    if (cache.has(columnId)) {
      return cache.get(columnId)!;
    }

    // Calculate and cache
    const style = getColumnStyle(columnId, fixedColumns);
    cache.set(columnId, style);
    return style;
  };
}

/**
 * Check if a column is fixed
 * @param columnId - The column identifier
 * @param fixedColumns - Configuration for fixed columns
 * @returns Boolean indicating if column is fixed (left or right)
 */
export function isColumnFixed(
  columnId: string,
  fixedColumns?: FixedColumnsConfig,
): boolean {
  if (!fixedColumns) return false;
  return (
    fixedColumns.left?.includes(columnId) ||
    fixedColumns.right?.includes(columnId) ||
    false
  );
}

/**
 * Get the position of a fixed column
 * @param columnId - The column identifier
 * @param fixedColumns - Configuration for fixed columns
 * @returns 'left', 'right', or null if not fixed
 */
export function getColumnFixedPosition(
  columnId: string,
  fixedColumns?: FixedColumnsConfig,
): "left" | "right" | null {
  if (!fixedColumns) return null;

  if (fixedColumns.left?.includes(columnId)) return "left";
  if (fixedColumns.right?.includes(columnId)) return "right";

  return null;
}
