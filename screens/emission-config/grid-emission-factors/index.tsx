import { SSWrapper } from "@/screens/components/wrapper";
import { GridEmissionFactorsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const GridEmissionFactorsScreen = () => {
  return (
    <GridEmissionFactorsProvider>
      <SSWrapper
        title="Grid Emission Factors"
        description="Configure country-specific electricity grid emission factors"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </GridEmissionFactorsProvider>
  );
};
