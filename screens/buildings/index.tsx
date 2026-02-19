import { AddBuilding } from "@/components/add-building";
import { PageHeader } from "@/components/page-header";
import { ExportButton } from "./export";
import { ImportButton } from "./import";
import { Filters } from "./filters";
import { Table } from "./table";
import { BuildingProvider } from "./building.context";
import { Pagination } from "./pagination";

export default function BuildingsScreen() {
  return (
    <BuildingProvider>
      <section className="w-full flex flex-col gap-6">
        <PageHeader
          title="Building Management"
          description="Manage and monitor all registered buildings"
        >
          <div className="flex items-center gap-2">
            <ImportButton />
            <ExportButton />
            <AddBuilding />
          </div>
        </PageHeader>
        <Filters />
        <div className="flex flex-col gap-4.75 overflow-x-auto w-full">
          <Table />
          <Pagination />
        </div>
      </section>
    </BuildingProvider>
  );
}
