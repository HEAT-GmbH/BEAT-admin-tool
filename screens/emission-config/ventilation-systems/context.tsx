"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { VentilationSystemFactor } from "@/models/ventilation-system";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const VentilationSystemsContext =
  createContext<PaginationTableContextType<VentilationSystemFactor> | null>(
    null,
  );

const PAGE_SIZE = 10;

export const VentilationSystemsProvider = ({
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
    queryKey: "ventilationSystems",
    queryFn: apiService.getVentilationSystemFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <VentilationSystemsContext.Provider
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
    </VentilationSystemsContext.Provider>
  );
};

export const useVentilationSystemsContext = () => {
  const context = useContext(VentilationSystemsContext);
  if (!context) {
    throw new Error(
      "useVentilationSystemsContext must be used within VentilationSystemsProvider",
    );
  }
  return context;
};
