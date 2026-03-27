import { Badge, BadgeVariant } from "@/components/ui/badge";
import { DataManagementSummary } from "@/models/data-management";

type SummaryMap = { label: string; badge?: BadgeVariant };

const summaryMap = {
  totalImports: {
    label: "Total Imports",
  },
  recordsProcessed: {
    label: "Records Processed",
  },
  failedImports: {
    label: "Failed Imports",
    badge: "destructive",
  },
  exportGenerated: {
    label: "Export Generated",
    badge: "secondary",
  },
} as const;

export const Summary = ({
  summary,
}: {
  summary: DataManagementSummary | null;
}) => {
  const items: (DataManagementSummary[keyof DataManagementSummary] &
    Required<SummaryMap>)[] = !summary
    ? []
    : [
        {
          ...summary.totalImports,
          ...summaryMap.totalImports,
          badge: summary.totalImports.note.startsWith("+")
            ? "default"
            : "destructive",
        },
        {
          ...summary.recordsProcessed,
          ...summaryMap.recordsProcessed,
          badge: summary.recordsProcessed.note.startsWith("+")
            ? "default"
            : "destructive",
        },
        { ...summary.failedImports, ...summaryMap.failedImports },
        { ...summary.exportGenerated, ...summaryMap.exportGenerated },
      ];

  if (!summary) return null;

  return (
    <ul className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex flex-col gap-1 p-4 rad-3 border border-border font-medium"
        >
          <label className="text-xs text-secondary-foreground">
            {item.label}
          </label>
          <span className="text-lg text-foreground">{item.value}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-secondary-foreground">
              {item.description}
            </span>
            <Badge variant={item.badge}>{item.note}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
};
