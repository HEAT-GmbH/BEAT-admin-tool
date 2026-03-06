import { SSWrapper } from "@/screens/components/wrapper";
import { HotWaterSystemsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const HotWaterSystemsScreen = () => {
  return (
    <HotWaterSystemsProvider>
      <SSWrapper
        title="Hot Water Systems"
        description="Complete the input form below to add a new hot water system."
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </HotWaterSystemsProvider>
  );
};
