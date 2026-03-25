"use client";

import useDebounce from "@/hooks/use-debounce";
import { Organization } from "@/models/organization";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

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
  createOrganisation: (data: {
    name: string;
    industry: string;
    country_id?: string;
    city_id?: string;
    invite_users?: { email: string; role: string }[];
  }) => Promise<Organization>;
  isCreating: boolean;
}

export const OrgContext = createContext<OrgContextType | null>(null);

const PAGE_SIZE = 10;

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
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
      apiService.getOrganisations({
        search: debouncedSearchValue,
        industry,
        page: currentPage,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: createOrg, isPending: isCreating } = useMutation({
    mutationFn: (data: {
      name: string;
      industry: string;
      country_id?: string;
      city_id?: string;
      invite_users?: { email: string; role: string }[];
    }) => apiService.createOrganisation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organisation created successfully");
    },
    onError: () => {
      toast.error("Failed to create organisation");
    },
  });

  const organizations = data?.data || null;
  const totalPages = data ? Math.ceil(data.totalItems / PAGE_SIZE) : 0;

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
        createOrganisation: createOrg,
        isCreating,
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
