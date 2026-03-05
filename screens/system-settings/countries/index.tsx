"use client";
import { SSWrapper } from "@/screens/components/wrapper";
import { CountriesProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const SSCountriesScreen = () => {
  return (
    <CountriesProvider>
      <SSWrapper
        title="Countries & Cities"
        description="Manage geographic locations for building registration"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </CountriesProvider>
  );
};
