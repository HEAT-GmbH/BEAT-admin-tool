"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useClimateTypesContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useClimateTypesContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
