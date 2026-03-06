"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useGridEmissionFactorsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useGridEmissionFactorsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
