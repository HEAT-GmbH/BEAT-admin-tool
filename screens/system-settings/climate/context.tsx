"use client";

import { usePaginationTable } from "@/hooks/use-pagination-table";
import { ClimateType } from "@/models/climate-type";
import { PaginationTableContextType } from "@/models/pagination-table-context";
import { apiService } from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { toast } from "sonner";

interface ClimateTypesContextType extends PaginationTableContextType<ClimateType> {
  createClimateType: (data: { name: string; description: string }) => Promise<void>;
  updateClimateType: (id: string, data: { name: string; description: string; status: string }) => Promise<void>;
  isMutating: boolean;
}

export const ClimateTypesContext = createContext<ClimateTypesContextType | null>(null);

const PAGE_SIZE = 10;

export const ClimateTypesProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const pagination = usePaginationTable({
    queryKey: "climateTypes",
    queryFn: apiService.getClimateTypes.bind(apiService),
    pageSize: PAGE_SIZE,
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      apiService.createClimateType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["climateTypes"] });
      toast.success("Climate type created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string; status: string } }) =>
      apiService.updateClimateType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["climateTypes"] });
      toast.success("Climate type updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <ClimateTypesContext.Provider
      value={{
        ...pagination,
        createClimateType: create,
        updateClimateType: (id, data) => update({ id, data }),
        isMutating: isCreating || isUpdating,
      }}
    >
      {children}
    </ClimateTypesContext.Provider>
  );
};

export const useClimateTypesContext = () => {
  const context = useContext(ClimateTypesContext);
  if (!context) throw new Error("useClimateTypesContext must be used within ClimateTypesProvider");
  return context;
};