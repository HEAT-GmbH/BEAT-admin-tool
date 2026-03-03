"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { ClimateType } from "@/models/climate-type";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const ClimateTypesContext =
  createContext<PaginationTableContextType<ClimateType> | null>(null);

const PAGE_SIZE = 10;

export const ClimateTypesProvider = ({
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
    queryKey: "climateTypes",
    queryFn: apiService.getClimateTypes,
    pageSize: PAGE_SIZE,
  });

  return (
    <ClimateTypesContext.Provider
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
    </ClimateTypesContext.Provider>
  );
};

export const useClimateTypesContext = () => {
  const context = useContext(ClimateTypesContext);
  if (!context) {
    throw new Error(
      "useClimateTypesContext must be used within ClimateTypesProvider",
    );
  }
  return context;
};
