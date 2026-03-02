"use client";

import { createContext, useContext, useState } from "react";
import { OperationalDataEntrySearchSchema } from "./schema";
import { OperationalDataEntry } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";

const PAGE_SIZE = 5;

interface OperationalDataEntryContextProps {
  onSearch: (data: OperationalDataEntrySearchSchema) => void;
  items: OperationalDataEntry[];
  isFetching: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  addToSelectedItems: (item: OperationalDataEntry) => void;
  removeFromSelectedItems: (item: OperationalDataEntry) => void;
  selectedItems: OperationalDataEntry[];
}

export const OperationalDataEntryContext =
  createContext<OperationalDataEntryContextProps | null>(null);

export const OperationalDataEntryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] =
    useState<OperationalDataEntrySearchSchema>({});
  const [selectedItems, setSelectedItems] = useState<OperationalDataEntry[]>(
    [],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["operational-data-entry", currentPage, searchParams],
    queryFn: () =>
      apiService.getEnergyCarriers({
        ...searchParams,
        currentPage,
        pageSize: PAGE_SIZE,
      }),
  });

  const addToSelectedItems = (item: OperationalDataEntry) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const removeFromSelectedItems = (item: OperationalDataEntry) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const onSearch = (data: OperationalDataEntrySearchSchema) => {
    setSearchParams(data);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const items = data?.data || [];
  const totalPages = Math.ceil((data?.totalItems ?? 0) / PAGE_SIZE);

  return (
    <OperationalDataEntryContext.Provider
      value={{
        onSearch,
        items,
        isFetching,
        currentPage,
        totalPages,
        onPageChange,
        onNextPage,
        onPreviousPage,
        addToSelectedItems,
        removeFromSelectedItems,
        selectedItems,
      }}
    >
      {children}
    </OperationalDataEntryContext.Provider>
  );
};

export const useOperationalDataEntryContext = () => {
  const context = useContext(OperationalDataEntryContext);
  if (!context) {
    throw new Error(
      "useOperationalDataEntryContext must be used within a OperationalDataEntryProvider",
    );
  }
  return context;
};
