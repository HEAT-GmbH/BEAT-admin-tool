import { SSWrapper } from "@/screens/components/wrapper";
import { FuelEmissionFactorsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const FuelEmissionFactorsScreen = () => {
  return (
    <FuelEmissionFactorsProvider>
      <SSWrapper
        title="Fuel Emission Factors"
        description="Configure emission factors for different fuel types"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </FuelEmissionFactorsProvider>
  );
};
