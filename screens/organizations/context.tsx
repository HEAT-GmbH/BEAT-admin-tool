"use client";

import useDebounce from "@/hooks/use-debounce";
import { Organization } from "@/models/organization";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface OrgContextType {
  setSearchValue: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  assignedTo: string;
  setAssignedTo: (value: string) => void;
  organizations: Organization[] | null;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const OrgContext = createContext<OrgContextType | null>(null);

const PAGE_SIZE = 10;

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [industry, setIndustry] = useState("All");
  const [location, setLocation] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "organizations",
      debouncedSearchValue,
      industry,
      location,
      assignedTo,
      currentPage,
    ],
    queryFn: () =>
      apiService.getOrganizations({
        search: debouncedSearchValue,
        industry,
        location,
        assignedTo,
        currentPage,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const organizations = data?.organizations || null;
  const totalPages = data ? Math.ceil(data.totalOrganizations / PAGE_SIZE) : 0;

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <OrgContext.Provider
      value={{
        setSearchValue,
        industry,
        setIndustry,
        location,
        setLocation,
        assignedTo,
        setAssignedTo,
        organizations,
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
    </OrgContext.Provider>
  );
};

export const useOrgContext = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrgContext must be used within OrgProvider");
  }
  return context;
};
