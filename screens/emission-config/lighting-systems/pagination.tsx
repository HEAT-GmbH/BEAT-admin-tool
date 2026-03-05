"use client";
import { Pagination as PaginationComponent } from "@/components/pagination";
import { useLightingSystemsContext } from "./context";

export const Pagination = () => {
  const {
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
    setCurrentPage,
  } = useLightingSystemsContext();

  return (
    <PaginationComponent
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
    />
  );
};
