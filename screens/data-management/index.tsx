import { PageHeader } from "@/components/page-header";
import { DataManagementSummary } from "@/models/data-management";
import { DataManagementTable } from "./data-management-table";
import { NewExport } from "./new-export";
import { NewImport } from "./new-import";
import { Summary } from "./summary";

const DataManagementScreen = ({
  summary,
}: {
  summary: DataManagementSummary | null;
}) => {
  return (
    <section className="w-full flex flex-col gap-6">
      <PageHeader
        title="Data Management"
        description="Manage bulk data imports and generate reports for your carbon emissions tracking"
      >
        <div className="flex items-center gap-2">
          <NewExport />
          <NewImport />
        </div>
      </PageHeader>
      <Summary summary={summary} />
      <DataManagementTable />
    </section>
  );
};

export default DataManagementScreen;
