"use client";

import { memo, useCallback } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

const ProductPagination = memo(function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) {
  const { t } = useTranslation();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback(
    (page) => {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onPageChange]
  );

  // Generate page numbers untuk display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage > totalPages - 3) {
        start = Math.max(2, totalPages - 3);
      }

      if (currentPage < 3) {
        end = Math.min(totalPages - 1, 4);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-8 md:mt-12 border-t border-gray-200 pt-6 md:pt-8">
      <div className="flex flex-col gap-6 md:gap-8 md:flex-row md:items-center md:justify-between">
        {/* Items Per Page Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            {t("products.productGrid.pagination.itemsPerPage")}
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca161e]"
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>

        {/* Page Info */}
        <div className="text-center text-xs sm:text-sm text-gray-600 order-3 md:order-2">
          {t("products.productGrid.pagination.showing", {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap order-2 md:order-3">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("products.productGrid.pagination.previous")}
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-gray-500 px-1 sm:px-2"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#ca161e] text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#ca161e] hover:text-[#ca161e]"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("products.productGrid.pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  );
});

ProductPagination.displayName = "ProductPagination";

export default ProductPagination;
