"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useBuildingTypesContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useBuildingTypesContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
