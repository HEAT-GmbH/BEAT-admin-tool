"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useCoolingSystemsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useCoolingSystemsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
