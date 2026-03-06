import { SSWrapper } from "@/screens/components/wrapper";
import { LiftEscalatorSystemsProvider } from "./context";
import { HeaderActions } from "./header-actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search";
import { Table } from "./table";

export const LiftEscalatorSystemsScreen = () => {
  return (
    <LiftEscalatorSystemsProvider>
      <SSWrapper
        title="Lift & Escalator Systems"
        description="Complete the input form below to add a new lift & escalator system."
        headerActions={<HeaderActions />}
        searchBar={<SearchBar />}
        table={<Table />}
        pagination={<Pagination />}
      />
    </LiftEscalatorSystemsProvider>
  );
};
