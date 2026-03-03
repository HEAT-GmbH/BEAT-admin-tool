"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useCountriesContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useCountriesContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
