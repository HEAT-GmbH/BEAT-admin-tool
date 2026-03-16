"use client";

import { Organization } from "@/models/organization";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext } from "react";
import { toast } from "sonner";
import useDebounce from "@/hooks/use-debounce";

interface OrgContextType {
  searchValue: string;
  setSearchValue: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  organizations: Organization[] | null;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  createOrganisation: (data: {
    name: string; industry: string;
    country_id?: string; city_id?: string;
    invite_users?: { email: string; role: string }[];
  }) => Promise<Organization>;
  isCreating: boolean;
}

export const OrgContext = createContext<OrgContextType | null>(null);

const PAGE_SIZE = 10;

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const searchValue = searchParams.get("search") ?? "";
  const industry = searchParams.get("industry") ?? "";
  const location = searchParams.get("location") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");

  const debouncedSearch = useDebounce(searchValue, 500);

  const updateParams = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k); else params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const setSearchValue = (v: string) => updateParams({ search: v || undefined, page: undefined });
  const setIndustry = (v: string) => updateParams({ industry: v || undefined, page: undefined });
  const setLocation = (v: string) => updateParams({ location: v || undefined, page: undefined });
  const setCurrentPage = (v: number) => updateParams({ page: v === 1 ? undefined : String(v) });
  const onNextPage = () => setCurrentPage(currentPage + 1);
  const onPreviousPage = () => setCurrentPage(currentPage - 1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["organisations", debouncedSearch, industry, location, currentPage],
    queryFn: () => apiService.getOrganisations({
      search: debouncedSearch || undefined,
      industry: industry || undefined,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    placeholderData: keepPreviousData,
  });

  const organizations = data?.data ?? null;
  const totalPages = data ? Math.ceil(data.totalItems / PAGE_SIZE) : 0;

  const { mutateAsync: createOrg, isPending: isCreating } = useMutation({
    mutationFn: apiService.createOrganisation.bind(apiService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      toast.success("Organisation created successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <OrgContext.Provider value={{
      searchValue, setSearchValue,
      industry, setIndustry,
      location, setLocation,
      organizations, isLoading, isFetching,
      currentPage, setCurrentPage, totalPages, onNextPage, onPreviousPage,
      createOrganisation: createOrg,
      isCreating,
    }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrgContext = () => {
  const context = useContext(OrgContext);
  if (!context) throw new Error("useOrgContext must be used within OrgProvider");
  return context;
};
