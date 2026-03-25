"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { BuildingType } from "@/models/building-type";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { createContext, useContext } from "react";

export const BuildingTypesContext =
  createContext<PaginationTableContextType<BuildingType> | null>(null);

const PAGE_SIZE = 10;

export const BuildingTypesProvider = ({
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
    queryKey: "buildingTypes",
    queryFn: apiService.getBuildingTypes,
    pageSize: PAGE_SIZE,
  });

  return (
    <BuildingTypesContext.Provider
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
    </BuildingTypesContext.Provider>
  );
};

export const useBuildingTypesContext = () => {
  const context = useContext(BuildingTypesContext);
  if (!context) {
    throw new Error(
      "useBuildingTypesContext must be used within BuildingTypesProvider",
    );
  }
  return context;
};
