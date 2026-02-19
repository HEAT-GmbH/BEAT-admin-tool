"use client";
import useDebounce from "@/hooks/use-debounce";
import { Building } from "@/models/building";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface BuildingContextValue {
  setSearchValue: (value: string) => void;
  status: Building["status"] | null;
  setStatus: (value: Building["status"] | null) => void;
  location: string;
  setLocation: (value: string) => void;
  buildingType: string;
  setBuildingType: (value: string) => void;
  assignedTo: string;
  setAssignedTo: (value: string) => void;
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
  const [status, setStatus] = useState<Building["status"] | null>(null);
  const [location, setLocation] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "buildings",
      debouncedSearchValue,
      status,
      location,
      buildingType,
      assignedTo,
      currentPage,
    ],
    queryFn: () =>
      apiService.getBuildings({
        search: debouncedSearchValue,
        status,
        location,
        buildingType,
        assignedTo,
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
        setSearchValue,
        status,
        setStatus,
        location,
        setLocation,
        buildingType,
        setBuildingType,
        assignedTo,
        setAssignedTo,
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
