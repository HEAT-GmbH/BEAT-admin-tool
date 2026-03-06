"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { CoolingSystemFactor } from "@/models/cooling-system";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const CoolingSystemsContext =
  createContext<PaginationTableContextType<CoolingSystemFactor> | null>(null);

const PAGE_SIZE = 10;

export const CoolingSystemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    searchValue,
    setSearchValue,
    items,
    isLoading,
    isFetching,
    currentPage,
    setCurrentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
  } = usePaginationTable({
    queryKey: "coolingSystems",
    queryFn: apiService.getCoolingSystemFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <CoolingSystemsContext.Provider
      value={{
        searchValue,
        setSearchValue,
        items,
        isLoading,
        isFetching,
        currentPage,
        setCurrentPage,
        totalPages,
        onNextPage,
        onPreviousPage,
      }}
    >
      {children}
    </CoolingSystemsContext.Provider>
  );
};

export const useCoolingSystemsContext = () => {
  const context = useContext(CoolingSystemsContext);
  if (!context) {
    throw new Error(
      "useCoolingSystemsContext must be used within CoolingSystemsProvider",
    );
  }
  return context;
};
