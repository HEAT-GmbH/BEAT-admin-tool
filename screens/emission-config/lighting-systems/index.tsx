import { SSWrapper } from "@/screens/components/wrapper";
import { LightingSystemsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const LightingSystemsScreen = () => {
  return (
    <LightingSystemsProvider>
      <SSWrapper
        title="Lighting Systems"
        description="Configure lighting system types and subtypes"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </LightingSystemsProvider>
  );
};
