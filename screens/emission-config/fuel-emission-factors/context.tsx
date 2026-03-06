"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { FuelEmissionFactor } from "@/models/fuel-emission-factor";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const FuelEmissionFactorsContext =
  createContext<PaginationTableContextType<FuelEmissionFactor> | null>(null);

const PAGE_SIZE = 10;

export const FuelEmissionFactorsProvider = ({
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
    queryKey: "fuelEmissionFactors",
    queryFn: apiService.getFuelEmissionFactors,
    pageSize: PAGE_SIZE,
  });

  return (
    <FuelEmissionFactorsContext.Provider
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
    </FuelEmissionFactorsContext.Provider>
  );
};

export const useFuelEmissionFactorsContext = () => {
  const context = useContext(FuelEmissionFactorsContext);
  if (!context) {
    throw new Error(
      "useFuelEmissionFactorsContext must be used within FuelEmissionFactorsProvider",
    );
  }
  return context;
};
