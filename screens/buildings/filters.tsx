"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuildingContext } from "./building.context";
import { Search, Globe } from "lucide-react";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { countriesService } from "@/services/countries.service";
import { CircleFlag } from "react-circle-flags";
import { InputWithIcon } from "@/components/input-with-icon";

export const Filters = () => {
  const {
    setSearchValue,
    status,
    setStatus,
    location,
    setLocation,
    buildingType,
    setBuildingType,
    assignedTo,
    setAssignedTo,
  } = useBuildingContext();

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
          value={status || "All"}
          onValueChange={(val) =>
            setStatus(val === "All" ? null : (val as any))
          }
        >
          <SelectTrigger className="w-[7.1875rem] h-9!">
            <span className="mr-1">Status:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <VirtualizedCombobox
          options={[
            {
              value: "All",
              label: "All locations",
              icon: <Globe className="h-4 w-4" />,
            },
            ...countriesService.getCountries().map(({ code, name }) => ({
              value: name,
              label: name,
              icon: <CircleFlag countryCode={code} className="h-4 w-4" />,
            })),
          ]}
          value={location || "All"}
          onValueChange={(value) => setLocation(value || "All")}
          placeholder="Locations: All"
          searchPlaceholder="Search..."
          className="w-[8.5625rem] h-9"
        />

        <Select
          value={buildingType || "All"}
          onValueChange={(val) => setBuildingType(val || "All")}
        >
          <SelectTrigger className="w-[9.9375rem] h-9!">
            <span className="mr-1">Building type:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Homes">Homes</SelectItem>
            <SelectItem value="Apartments">Apartments</SelectItem>
            <SelectItem value="Hotels">Hotels</SelectItem>
            <SelectItem value="Resort">Resort</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={assignedTo || "All"}
          onValueChange={(val) => setAssignedTo(val || "All")}
        >
          <SelectTrigger className="w-[9.4375rem] h-9!">
            <span className="mr-1">Assigned to:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Liam Miller">Liam Miller</SelectItem>
            <SelectItem value="Ava Thompson">Ava Thompson</SelectItem>
            <SelectItem value="Noah Garcia">Noah Garcia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
