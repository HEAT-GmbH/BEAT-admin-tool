"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useVentilationSystemsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useVentilationSystemsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
