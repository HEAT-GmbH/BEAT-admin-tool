"use client";
import { Pagination as PaginationComponent } from "@/components/pagination";
import { useVentilationSystemsContext } from "./context";

export const Pagination = () => {
  const {
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
    setCurrentPage,
  } = useVentilationSystemsContext();

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
