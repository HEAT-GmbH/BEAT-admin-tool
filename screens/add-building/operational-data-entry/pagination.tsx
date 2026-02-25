"use client";
import { useOperationalDataEntryContext } from "./operational-data-entry.context";
import { Pagination as ReusablePagination } from "@/components/pagination";

export const Pagination = () => {
  const { currentPage, totalPages, onPageChange, onNextPage, onPreviousPage } =
    useOperationalDataEntryContext();

  return (
    <ReusablePagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={onPageChange}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
    />
  );
};
