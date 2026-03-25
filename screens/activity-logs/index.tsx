import { PageHeader } from "@/components/page-header";
import { Actions } from "./actions";
import { ActivityLogs } from "./activity-logs";
import { ActivityLogProvider } from "./context";
import { Controls } from "./controls";
import { Footer } from "./footer";

export const ActivityLogsScreen = () => {
  return (
    <ActivityLogProvider>
      <section className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full">
        <div className="flex flex-col gap-5 w-full pt-5 pb-4 px-8 sticky top-19 border-b border-border z-10 bg-card">
          <div className="flex items-start justify-between">
            <PageHeader
              title="Activity Logs"
              description="All user actions across the system in chronological order"
            />
            <Actions />
          </div>
          <Controls />
        </div>
        <ActivityLogs />
        <Footer />
      </section>
    </ActivityLogProvider>
  );
};
