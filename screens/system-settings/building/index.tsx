import { SSWrapper } from "@/screens/components/wrapper";
import { BuildingTypesProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

const SSBuildingScreen = () => {
  return (
    <BuildingTypesProvider>
      <SSWrapper
        title="Building Types"
        description="Configure building categories and sub-types"
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </BuildingTypesProvider>
  );
};

export default SSBuildingScreen;
