import { SSWrapper } from "@/screens/components/wrapper";
import { CoolingSystemsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const CoolingSystemsScreen = () => {
  return (
    <CoolingSystemsProvider>
      <SSWrapper
        title="Cooling Systems"
        description="Configure cooling system types and subtypes"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </CoolingSystemsProvider>
  );
};
