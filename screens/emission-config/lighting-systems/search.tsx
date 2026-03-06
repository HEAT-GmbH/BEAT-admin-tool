"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useLightingSystemsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useLightingSystemsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
