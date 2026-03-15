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
import { countriesService } from "@/services/countries.service";
import { CircleFlag } from "react-circle-flags";
import { Globe } from "lucide-react";
import { useOrgContext } from "./context";

export const Filters = () => {
  const { searchValue, setSearchValue, industry, setIndustry, location, setLocation } = useOrgContext();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 max-w-[31.125rem]">
        <InputWithIcon
          startIcon="search-2-line"
          placeholder="Search..."
          groupClassName="h-9"
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={industry || "All"}
          onValueChange={(val) => setIndustry(val === "All" ? "" : val)}
        >
          <SelectTrigger className="w-[10.1875rem] h-9!">
            <span className="mr-1 text-(--text--sub-600)">Industry:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Construction">Construction</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
          </SelectContent>
        </Select>

        <VirtualizedCombobox
          options={[
            { value: "All", label: "All locations", icon: <Globe className="h-4 w-4" /> },
            ...countriesService.getCountries().map(({ code, name }) => ({
              value: name,
              label: name,
              icon: <CircleFlag countryCode={code} className="h-4 w-4" />,
            })),
          ]}
          value={location || "All"}
          onValueChange={(val) => setLocation(val === "All" ? "" : val)}
          placeholder="Locations: All"
          searchPlaceholder="Search..."
          className="w-[10.1875rem] h-9"
        />
      </div>
    </div>
  );
};
