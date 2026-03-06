"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { GridEmissionFactor } from "@/models/grid-emission-factor";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const GridEmissionFactorsContext =
  createContext<PaginationTableContextType<GridEmissionFactor> | null>(null);

const PAGE_SIZE = 10;

export const GridEmissionFactorsProvider = ({
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
    queryKey: "gridEmissionFactors",
    queryFn: apiService.getGridEmissionFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <GridEmissionFactorsContext.Provider
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
    </GridEmissionFactorsContext.Provider>
  );
};

export const useGridEmissionFactorsContext = () => {
  const context = useContext(GridEmissionFactorsContext);
  if (!context) {
    throw new Error(
      "useGridEmissionFactorsContext must be used within GridEmissionFactorsProvider",
    );
  }
  return context;
};
