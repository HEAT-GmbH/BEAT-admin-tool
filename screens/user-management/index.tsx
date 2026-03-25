import { PageHeader } from "@/components/page-header";
import { TabsWrapper } from "./tabs-wrapper";

export const UserManagementScreen = () => {
  return (
    <section className="w-full flex flex-col gap-6">
      <PageHeader
        title="User Management"
        description="Manage system administrators and organization users"
      />
      <TabsWrapper />
    </section>
  );
};
