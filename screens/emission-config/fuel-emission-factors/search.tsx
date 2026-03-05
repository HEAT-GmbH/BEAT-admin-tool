"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useFuelEmissionFactorsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useFuelEmissionFactorsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
