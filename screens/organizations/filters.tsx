"use client";
import { InputWithIcon } from "@/components/input-with-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { Globe } from "lucide-react";
import { useOrgContext } from "./context";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const Filters = () => {
  const {
    setSearchValue,
    industry,
    setIndustry,
    location,
    setLocation,
    assignedTo,
    setAssignedTo,
  } = useOrgContext();

  const { data: countriesData } = useQuery({
    queryKey: ["countries-list"],
    queryFn: () => apiService.getCountrySettings({ currentPage: 1, pageSize: 300 }),
    staleTime: 5 * 60 * 1000,
  });

  const countryOptions = [
    { value: "All", label: "All locations", icon: <Globe className="h-4 w-4" /> },
    ...(countriesData?.data ?? []).map((c) => ({
      value: c.name,
      label: c.name,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 max-w-[31.125rem]">
        <InputWithIcon
          startIcon="search-2-line"
          placeholder="Search..."
          groupClassName="h-9"
          className="pl-10"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={industry || "All"}
          onValueChange={(val) => setIndustry(val || "All")}
        >
          <SelectTrigger className="w-[10.1875rem] h-9!">
            <span className="mr-1 text-(--text--sub-600)">Industry:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="real_estate">Real Estate</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <VirtualizedCombobox
          options={countryOptions}
          value={location || "All"}
          onValueChange={(value) => setLocation(value || "All")}
          placeholder="Locations: All"
          searchPlaceholder="Search..."
          className="w-[10.1875rem] h-9"
        />

        <Select
          value={assignedTo || "All"}
          onValueChange={(val) => setAssignedTo(val || "All")}
        >
          <SelectTrigger className="w-[11.1875rem] h-9!">
            <span className="mr-1 text-(--text--sub-600)">Assigned to:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Liam Miller">Liam Miller</SelectItem>
            <SelectItem value="Ava Thompson">Ava Thompson</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};