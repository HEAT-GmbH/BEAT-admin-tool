"use client";
import useDebounce from "@/hooks/use-debounce";
import { Building } from "@/models/building";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface BuildingContextValue {
  setSearchValue: (value: string) => void;
  searchValue: string;
  draft: boolean | null;
  setDraft: (value: boolean | null) => void;
  country: string;
  setCountry: (value: string) => void;
  climateZone: string;
  setClimateZone: (value: string) => void;
  organisation: string;
  setOrganisation: (value: string) => void;
  buildings: Building[] | null;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const BuildingContext = createContext<BuildingContextValue | null>(null);
const PAGE_SIZE = 15;

export const BuildingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [draft, setDraft] = useState<boolean | null>(null);
  const [country, setCountry] = useState("");
  const [climateZone, setClimateZone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "buildings",
      debouncedSearchValue,
      draft,
      country,
      climateZone,
      organisation,
      currentPage,
    ],
    queryFn: () =>
      apiService.getBuildings({
        search: debouncedSearchValue,
        draft,
        country,
        climateZone,
        organisation,
        currentPage,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const buildings = data?.buildings || null;
  const totalPages = data ? Math.ceil(data.totalBuildings / PAGE_SIZE) : 0;

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <BuildingContext.Provider
      value={{
        searchValue,
        setSearchValue,
        draft,
        setDraft,
        country,
        setCountry,
        climateZone,
        setClimateZone,
        organisation,
        setOrganisation,
        buildings,
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
    </BuildingContext.Provider>
  );
};

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error(
      "useBuildingContext must be used within a BuildingProvider",
    );
  }
  return context;
};
