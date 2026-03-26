"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuildingContext } from "./building.context";
import { Globe } from "lucide-react";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { InputWithIcon } from "@/components/input-with-icon";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const Filters = () => {
  const {
    setSearchValue,
    draft,
    setDraft,
    country,
    setCountry,
    climateZone,
    setClimateZone,
  } = useBuildingContext();

  const { data: countriesData } = useQuery({
    queryKey: ["countries-list"],
    queryFn: () => apiService.getCountrySettings({ currentPage: 1, pageSize: 300 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: climateTypesData } = useQuery({
    queryKey: ["climate-types-list"],
    queryFn: () => apiService.getClimateTypes({ currentPage: 1, pageSize: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const draftValue =
    draft === null ? "All" : draft === true ? "Draft" : "Published";

  const handleDraftChange = (val: string | null) => {
    if (!val || val === "All") setDraft(null);
    else if (val === "Draft") setDraft(true);
    else setDraft(false);
  };

  const countryOptions = [
    { value: "All", label: "All locations", icon: <Globe className="h-4 w-4" /> },
    ...(countriesData?.data ?? []).map((c) => ({
      value: c.name,
      label: c.name,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 max-w-124.5">
        <InputWithIcon
          startIcon="search-2-line"
          placeholder="Search..."
          groupClassName="h-9"
          className="pl-10"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={draftValue} onValueChange={handleDraftChange}>
          <SelectTrigger className="w-28.75 h-9!">
            <span className="mr-1">Status:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
          </SelectContent>
        </Select>

        <VirtualizedCombobox
          options={countryOptions}
          value={country || "All"}
          onValueChange={(value) => setCountry(!value || value === "All" ? "" : value)}
          placeholder="Country: All"
          searchPlaceholder="Search..."
          className="w-38 h-9"
        />

        <Select
          value={climateZone || "All"}
          onValueChange={(val) => setClimateZone(!val || val === "All" ? "" : val)}
        >
          <SelectTrigger className="w-42 h-9!">
            <span className="mr-1">Climate zone:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {(climateTypesData?.data ?? []).map((ct) => (
              <SelectItem key={ct.id} value={ct.name}>{ct.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
