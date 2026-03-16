import { ReportProvider } from "./context";
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";

export const ReportsScreen = () => {
  return (
    <ReportProvider>
      <section className="grid grid-cols-[auto_1fr] overflow-hidden bg-muted">
        <LeftPanel />
        <RightPanel />
      </section>
    </ReportProvider>
  );
};
