"use client";

import { SegmentedControl } from "@/components/segmented-control";
import { useActivityLogContext } from "./context";
import { capitalize } from "@/lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "all",
  "User Management",
  "Building Management",
  "Organization Management",
  "Emission Config",
  "Data Management",
  "Authentication",
  "System Settings",
].map((str) => ({ value: str, label: capitalize(str) }));

export const Controls = () => {
  const {
    timeline,
    setTimeline,
    status,
    setStatus,
    category,
    setCategory,
    search,
    setSearch,
  } = useActivityLogContext();

  const clear = () => {
    setSearch("");
    setTimeline("all");
    setStatus("all");
    setCategory("all");
  };

  const showClear =
    !!search || timeline !== "all" || category !== "all" || status !== "all";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <InputGroup className="flex-1 h-9.5 min-w-38 max-w-80">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <SegmentedControl
        value={timeline}
        onValueChange={setTimeline}
        items={[
          { value: "24hrs", label: "24 hrs" },
          { value: "7days", label: "7 days" },
          { value: "30days", label: "30 days" },
          { value: "all", label: "All" },
        ]}
      />
      <SegmentedControl
        value={status}
        onValueChange={setStatus}
        items={[
          { value: "all", label: "All" },
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
        ]}
      />
      <Select
        defaultValue="all"
        value={category}
        onValueChange={(v) => setCategory(v as typeof category)}
      >
        <SelectTrigger className="h-9.75! min-w-42 shadow-xs">
          <SelectValue>
            {(v) => CATEGORIES.find((i) => i.value === v)?.label ?? "Category"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="sm:w-fit">
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showClear && (
        <Button
          variant="destructive"
          className="bg-transparent text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          onClick={clear}
        >
          <X /> Clear
        </Button>
      )}
    </div>
  );
};
