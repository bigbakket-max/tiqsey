import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemUnitName?: string;
  className?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemUnitName = "items",
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Generate page list matching Ant Design style (image 1)
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      // Exactly matches image 1: 1 2 3 4 5 ... 55884
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle: 1 ... page-1 page page+1 ... totalPages
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3.5 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs select-none ${className}`}
    >
      {/* Total items: Total 558840 items */}
      <div className="text-xs font-normal text-slate-800 dark:text-slate-200 shrink-0 mr-0.5">
        Total {totalItems} {itemUnitName}
      </div>

      {/* Previous chevron: < */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1.5">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-6 text-center text-slate-400 dark:text-slate-500 text-xs font-medium tracking-widest flex items-center justify-center select-none"
              >
                •••
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[28px] h-7 px-1.5 flex items-center justify-center text-xs rounded-md transition-all cursor-pointer ${
                isActive
                  ? "border border-[#f97316] text-[#f97316] font-semibold bg-white dark:bg-slate-900 shadow-2xs"
                  : "border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:border-[#f97316] hover:text-[#f97316]"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next chevron: > */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page Size Selector: [ 10 / page ⌄ ] */}
      {onItemsPerPageChange && (
        <div className="relative inline-flex items-center ml-0.5">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              onItemsPerPageChange(newSize);
              onPageChange(1);
            }}
            className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-normal rounded-md pl-2.5 pr-6 py-1 hover:border-[#f97316] focus:outline-none focus:border-[#f97316] transition-colors cursor-pointer shadow-2xs"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
        </div>
      )}
    </div>
  );
};
