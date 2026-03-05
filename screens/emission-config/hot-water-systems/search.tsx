"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useHotWaterSystemsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useHotWaterSystemsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
