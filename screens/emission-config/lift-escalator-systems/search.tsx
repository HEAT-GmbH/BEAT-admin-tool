"use client";
import { SSSearchBar } from "@/screens/components/search";
import { useLiftEscalatorSystemsContext } from "./context";

export const SearchBar = () => {
  const { setSearchValue } = useLiftEscalatorSystemsContext();

  return <SSSearchBar setSearchValue={setSearchValue} />;
};
