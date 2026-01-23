"use client";

import { memo, useCallback } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

const ProductFilters = memo(function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedApplication,
  onApplicationChange,
  availableTypes,
  availableApplications,
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
    (type) => {
      onTypeChange(type);
    },
    [onTypeChange]
  );

  const handleApplicationChange = useCallback(
    (app) => {
      onApplicationChange(app);
    },
    [onApplicationChange]
  );

  return (
    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t("products.productGrid.searchPlaceholder")}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t("products.productGrid.searchPlaceholder")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca161e] focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filters Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Product Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t("products.productGrid.filters.type")}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === null
                  ? "bg-[#ca161e] text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-[#ca161e]"
              }`}
            >
              {t("products.productGrid.filters.all")}
            </button>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "bg-[#ca161e] text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#ca161e]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Application/Features Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t("products.productGrid.filters.application")}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleApplicationChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedApplication === null
                  ? "bg-[#1f4faa] text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-[#1f4faa]"
              }`}
            >
              {t("products.productGrid.filters.all")}
            </button>
            {availableApplications.map((app) => (
              <button
                key={app}
                onClick={() => handleApplicationChange(app)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedApplication === app
                    ? "bg-[#1f4faa] text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#1f4faa]"
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            onClick={onClearFilters}
            className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
          >
            {t("products.productGrid.filters.clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
});

ProductFilters.displayName = "ProductFilters";

export default ProductFilters;
