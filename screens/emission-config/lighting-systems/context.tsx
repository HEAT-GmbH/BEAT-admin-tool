"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { LightingSystemFactor } from "@/models/lighting-system";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const LightingSystemsContext =
  createContext<PaginationTableContextType<LightingSystemFactor> | null>(null);

const PAGE_SIZE = 10;

export const LightingSystemsProvider = ({
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
    queryKey: "lightingSystems",
    queryFn: apiService.getLightingSystemFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <LightingSystemsContext.Provider
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
    </LightingSystemsContext.Provider>
  );
};

export const useLightingSystemsContext = () => {
  const context = useContext(LightingSystemsContext);
  if (!context) {
    throw new Error(
      "useLightingSystemsContext must be used within LightingSystemsProvider",
    );
  }
  return context;
};
