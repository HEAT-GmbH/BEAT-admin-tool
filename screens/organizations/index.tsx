import { PageHeader } from "@/components/page-header";
import { OrgProvider } from "./context";
import { Filters } from "./filters";
import { Pagination } from "./pagination";
import { Table } from "./table";
import { AddOrg } from "./add-org";

export const OrganizationsScreen = () => {
  return (
    <OrgProvider>
      <section className="size-full flex flex-col gap-6">
        <PageHeader
          title="Organizations"
          description="Manage, add, remove and edit organizations here"
        >
          <AddOrg />
        </PageHeader>
        <Filters />
        <div className="flex flex-col gap-4.75 overflow-x-auto w-full">
          <Table />
          <Pagination />
        </div>
      </section>
    </OrgProvider>
  );
};
