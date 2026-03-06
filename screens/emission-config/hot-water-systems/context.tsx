"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { HotWaterSystemFactor } from "@/models/hot-water-system";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const HotWaterSystemsContext =
  createContext<PaginationTableContextType<HotWaterSystemFactor> | null>(null);

const PAGE_SIZE = 10;

export const HotWaterSystemsProvider = ({
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
    queryKey: "hotWaterSystems",
    queryFn: apiService.getHotWaterSystemFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <HotWaterSystemsContext.Provider
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
    </HotWaterSystemsContext.Provider>
  );
};

export const useHotWaterSystemsContext = () => {
  const context = useContext(HotWaterSystemsContext);
  if (!context) {
    throw new Error(
      "useHotWaterSystemsContext must be used within HotWaterSystemsProvider",
    );
  }
  return context;
};
