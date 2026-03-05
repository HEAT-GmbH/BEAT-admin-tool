"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { LiftEscalatorSystemFactor } from "@/models/lift-escalator-system";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const LiftEscalatorSystemsContext =
  createContext<PaginationTableContextType<LiftEscalatorSystemFactor> | null>(
    null,
  );

const PAGE_SIZE = 10;

export const LiftEscalatorSystemsProvider = ({
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
    queryKey: "liftEscalatorSystems",
    queryFn: apiService.getLiftEscalatorSystemFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <LiftEscalatorSystemsContext.Provider
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
    </LiftEscalatorSystemsContext.Provider>
  );
};

export const useLiftEscalatorSystemsContext = () => {
  const context = useContext(LiftEscalatorSystemsContext);
  if (!context) {
    throw new Error(
      "useLiftEscalatorSystemsContext must be used within LiftEscalatorSystemsProvider",
    );
  }
  return context;
};
