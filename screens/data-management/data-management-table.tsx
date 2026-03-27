import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportsTable } from "./exports-table";
import { ImportsTable } from "./imports-table";

export const DataManagementTable = () => {
  return (
    <section className="w-full flex-1">
      <Tabs defaultValue="imports" className="gap-4">
        <div className="w-full border-b border-border">
          <TabsList variant="line">
            <TabsTrigger value="imports">Imports</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="imports">
          <ImportsTable />
        </TabsContent>
        <TabsContent value="exports">
          <ExportsTable />
        </TabsContent>
      </Tabs>
    </section>
  );
};
