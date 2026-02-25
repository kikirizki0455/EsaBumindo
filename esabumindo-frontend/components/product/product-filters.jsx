"use client";

import { memo, useCallback } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Search, X } from "lucide-react";

const ProductFilters = memo(function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  availableTypes,
  hasActiveFilters,
  onClearFilters,
}) {
  const { t } = useTranslation();

  const handleSearchChange = useCallback(
    (e) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleTypeChange = useCallback(
    (e) => {
      const value = e.target.value;
      onTypeChange(value === "all" ? null : value);
    },
    [onTypeChange]
  );

  return (
    <div className="mb-8">
      {/* Simple Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("products.productGrid.searchPlaceholder")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent text-sm"
          />
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <select
            value={selectedType || "all"}
            onChange={handleTypeChange}
            className="appearance-none w-full sm:w-48 px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent text-sm bg-white cursor-pointer"
          >
            <option value="all">
              {t("products.productGrid.filters.all")} -{" "}
              {t("products.productGrid.filters.type")}
            </option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Clear Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">
              {t("products.productGrid.filters.clearAll")}
            </span>
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              "{searchQuery}"
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              {selectedType}
              <button
                onClick={() => onTypeChange(null)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ProductFilters.displayName = "ProductFilters";

export default ProductFilters;
