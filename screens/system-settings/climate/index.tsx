import { SSWrapper } from "@/screens/components/wrapper";
import { ClimateTypesProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

const SSClimateScreen = () => {
  return (
    <ClimateTypesProvider>
      <SSWrapper
        title="Climate Types"
        description="Configure climate classifications for building assessments"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </ClimateTypesProvider>
  );
};

export default SSClimateScreen;
