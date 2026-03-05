"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { CountrySetting } from "@/models/country-setting";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const CountriesContext =
  createContext<PaginationTableContextType<CountrySetting> | null>(null);

const PAGE_SIZE = 10;

export const CountriesProvider = ({
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
    queryKey: "countrySettings",
    queryFn: apiService.getCountrySettings,
    pageSize: PAGE_SIZE,
  });

  return (
    <CountriesContext.Provider
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
    </CountriesContext.Provider>
  );
};

export const useCountriesContext = () => {
  const context = useContext(CountriesContext);
  if (!context) {
    throw new Error(
      "useCountriesContext must be used within CountriesProvider",
    );
  }
  return context;
};
