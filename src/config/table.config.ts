// Module-based table configuration
export interface TableModuleConfig {
  // Basic features
  enableSearch?: boolean;
  enableFilters?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;

  // Advanced features
  enableColumnVisibility?: boolean;
  enableHorizontalScroll?: boolean;
  enableRowSelection?: boolean;
  enableExport?: boolean;

  // Fixed columns configuration
  fixedColumns?: {
    left?: string[]; // Column IDs to fix on the left
    right?: string[]; // Column IDs to fix on the right
  };

  // UI customization
  searchPlaceholder?: string;
  showRowCount?: boolean;
  compactMode?: boolean;

  // Module-specific settings
  module?: string; // e.g., 'state', 'customer', 'task'
}

// Predefined configurations for different modules
export const TABLE_MODULE_CONFIGS: Record<string, TableModuleConfig> = {
  // State module configuration
  state: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: false,
    enableRowSelection: false,
    enableExport: false,
    fixedColumns: {
      left: ["name"],
      right: ["actions"],
    },
    searchPlaceholder: "Search states by name...",
    showRowCount: true,
    compactMode: false,
    module: "state",
  },

  district: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: false,
    enableRowSelection: false,
    enableExport: false,
    fixedColumns: {
      left: ["name"],
      right: ["actions"],
    },
    searchPlaceholder: "Search districts by name...",
    showRowCount: true,
    compactMode: false,
    module: "district",
  },

  city: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: false,
    enableRowSelection: false,
    enableExport: false,
    fixedColumns: {
      left: ["name"],
      right: ["actions"],
    },
    searchPlaceholder: "Search cities by name...",
    showRowCount: true,
    compactMode: false,
    module: "city",
  },

  item: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: false,
    enableRowSelection: false,
    enableExport: false,
    fixedColumns: {
      left: ["id", "name"],
    },
    searchPlaceholder: "Search states by name...",
    showRowCount: true,
    compactMode: false,
    module: "state",
  },

  // Customer module configuration
  customer: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: true, // Enable for customer with many columns
    enableRowSelection: true,
    enableExport: true,
    fixedColumns: {
      left: ["id", "name"],
      right: ["actions"],
    },
    searchPlaceholder: "Search customers...",
    showRowCount: true,
    compactMode: false,
    module: "customer",
  },

  // Task module configuration (like shadcn example)
  task: {
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: true,
    enableHorizontalScroll: true,
    enableRowSelection: true,
    enableExport: true,
    fixedColumns: {
      left: ["select", "title"], // Fix checkbox and title
    },
    searchPlaceholder: "Filter tasks...",
    showRowCount: true,
    compactMode: true,
    module: "task",
  },

  // Default configuration
  default: {
    enableSearch: true,
    enableFilters: false,
    enablePagination: true,
    enableSorting: true,
    enableColumnVisibility: false,
    enableHorizontalScroll: false,
    enableRowSelection: false,
    enableExport: false,
    searchPlaceholder: "Search...",
    showRowCount: false,
    compactMode: false,
    module: "default",
  },
};

// Helper function to get module configuration
export function getTableModuleConfig(module: string): TableModuleConfig {
  return TABLE_MODULE_CONFIGS[module] || TABLE_MODULE_CONFIGS.default;
}

// Helper function to merge custom config with module config
export function mergeTableConfig(
  module: string,
  customConfig?: Partial<TableModuleConfig>,
): TableModuleConfig {
  const moduleConfig = getTableModuleConfig(module);
  return {
    ...moduleConfig,
    ...customConfig,
  };
}
