"use client";
import { useOrgContext } from "./context";
import { Pagination as ReusablePagination } from "@/components/pagination";

export const Pagination = () => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    onNextPage,
    onPreviousPage,
  } = useOrgContext();

  return (
    <ReusablePagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      className="justify-center mt-6"
    />
  );
};
