"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { BuildingType } from "@/models/building-type";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { toast } from "sonner";

type BuildingTypePayload = { name: string; has_subtypes: boolean; subtypes: { name: string }[] };

interface BuildingTypesContextType extends PaginationTableContextType<BuildingType> {
  createBuildingType: (data: BuildingTypePayload) => Promise<void>;
  updateBuildingType: (id: string, data: BuildingTypePayload) => Promise<void>;
  isMutating: boolean;
}

export const BuildingTypesContext = createContext<BuildingTypesContextType | null>(null);

const PAGE_SIZE = 10;

export const BuildingTypesProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const pagination = usePaginationTable({
    queryKey: "buildingTypes",
    queryFn: apiService.getBuildingTypes.bind(apiService),
    pageSize: PAGE_SIZE,
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (data: BuildingTypePayload) => apiService.createBuildingType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildingTypes"] });
      toast.success("Building type created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BuildingTypePayload }) =>
      apiService.updateBuildingType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildingTypes"] });
      toast.success("Building type updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <BuildingTypesContext.Provider
      value={{
        ...pagination,
        createBuildingType: create,
        updateBuildingType: (id, data) => update({ id, data }),
        isMutating: isCreating || isUpdating,
      }}
    >
      {children}
    </BuildingTypesContext.Provider>
  );
};

export const useBuildingTypesContext = () => {
  const context = useContext(BuildingTypesContext);
  if (!context) throw new Error("useBuildingTypesContext must be used within BuildingTypesProvider");
  return context;
};