import { SSWrapper } from "@/screens/components/wrapper";
import { VentilationSystemsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const VentilationSystemsScreen = () => {
  return (
    <VentilationSystemsProvider>
      <SSWrapper
        title="Ventilation Systems"
        description="Configure ventilation system types and subtypes"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </VentilationSystemsProvider>
  );
};
