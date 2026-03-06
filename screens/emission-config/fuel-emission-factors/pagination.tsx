"use client";
import { Pagination as PaginationComponent } from "@/components/pagination";
import { useFuelEmissionFactorsContext } from "./context";

export const Pagination = () => {
  const {
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
    setCurrentPage,
  } = useFuelEmissionFactorsContext();

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
