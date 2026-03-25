"use client";

import { Loader } from "@/components/loader";
import { useIntersection } from "@/hooks/use-intersection";
import { timeAgo } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ActivityLogEntry } from "@/models/activity-log";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import {
  Building2,
  FileText,
  Flame,
  Globe,
  LucideIcon,
  Settings,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useActivityLogContext } from "./context";
import { ActivityDetailDialog } from "./activity-detail-dialog";

const ACTION_ICON_MAP: Record<
  string,
  { icon: LucideIcon; bg: string; fg: string }
> = {
  user: { icon: UserPlus, bg: "bg-primary/10", fg: "text-primary" },
  building: {
    icon: Building2,
    bg: "bg-(--state--warning--lighter)",
    fg: "text-(--state--warning--base)",
  },
  org: {
    icon: Globe,
    bg: "bg-(--state--feature--lighter)",
    fg: "text-(--state--feature--base)",
  },
  data: {
    icon: FileText,
    bg: "bg-(--state--verified--lighter)",
    fg: "text-(--state--verified--base)",
  },
  auth: {
    icon: ShieldAlert,
    bg: "bg-(--state--error--lighter)",
    fg: "text-(--state--error--base)",
  },
  settings: {
    icon: Settings,
    bg: "bg-secondary",
    fg: "text-secondary-foreground",
  },
  emission: { icon: Flame, bg: "bg-chart-4/10", fg: "text-chart-4" },
};

const formatDateGroup = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisYear(date)) return format(date, "EEEE, MMMM do");
  return format(date, "EEEE, MMMM do, yyyy");
};

export const ActivityLogs = () => {
  const {
    query: {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status: queryStatus,
    },
  } = useActivityLogContext();

  const [selectedEntry, setSelectedEntry] = useState<ActivityLogEntry | null>(
    null,
  );

  const loaderRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(loaderRef, "100px");

  const fetchNextPageEvent = useEffectEvent(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });
  useEffect(() => {
    fetchNextPageEvent();
  }, [isIntersecting, hasNextPage, isFetchingNextPage]);

  const groupedLogs = useMemo(() => {
    const flattened = data?.pages.flatMap((page) => page?.data || []) || [];
    const groups: { date: string; logs: ActivityLogEntry[] }[] = [];

    flattened.forEach((log) => {
      const dateStr = formatDateGroup(log.timestamp);
      const existingGroup = groups.find((g) => g.date === dateStr);
      if (existingGroup) {
        existingGroup.logs.push(log);
      } else {
        groups.push({ date: dateStr, logs: [log] });
      }
    });

    return groups;
  }, [data]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl">
          {queryStatus === "pending" ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <Loader size={48} />
            </div>
          ) : (
            <>
              {groupedLogs.map((group, groupIdx) => (
                <div key={group.date} className="mb-2">
                  <div className="flex items-center gap-2 mb-3 pl-12">
                    <h3 className="text-xs font-medium text-secondary-foreground capitalize tracking-wider">
                      {group.date}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="space-y-0">
                    {group.logs.map((log, logIdx) => {
                      const isLastInGroup = logIdx === group.logs.length - 1;
                      const isLastGroup = groupIdx === groupedLogs.length - 1;
                      return (
                        <TimelineEntry
                          key={log.id}
                          entry={log}
                          isLast={isLastInGroup && isLastGroup}
                          onClick={() => setSelectedEntry(log)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              {groupedLogs.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p>No activity logs found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          <div ref={loaderRef} className="py-4 flex justify-center">
            {isFetchingNextPage && <Loader size={20} />}
            {!hasNextPage && groupedLogs.length > 0 && (
              <p className="text-xs text-muted-foreground">
                End of activity logs
              </p>
            )}
          </div>
        </div>
      </div>
      <ActivityDetailDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </>
  );
};

function TimelineEntry({
  entry,
  isLast,
  onClick,
}: {
  entry: ActivityLogEntry;
  isLast: boolean;
  onClick: () => void;
}) {
  const iconInfo = ACTION_ICON_MAP[entry.iconType] || ACTION_ICON_MAP.settings;
  const Icon = iconInfo.icon;
  const isFailed = entry.status === "failed";

  return (
    <div className="flex gap-0 min-h-12">
      <div className="flex flex-col items-center w-10 shrink-0">
        <div
          className={cn(
            "size-7 flex items-center justify-center shrink-0 rounded-full",
            isFailed ? "bg-destructive/10" : iconInfo.bg,
          )}
        >
          <Icon
            size={14}
            className={isFailed ? "text-destructive" : iconInfo.fg}
          />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>

      <button
        onClick={onClick}
        className={cn(
          "flex-1 text-left ml-2 pb-5 group cursor-pointer min-w-0",
        )}
      >
        <div className="flex items-start">
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-sm">
              <span className="font-medium">{entry.userName}</span>{" "}
              <span className="text-secondary-foreground">
                {entry.actionVerb}
              </span>{" "}
              <span className="font-medium">{entry.actionTarget}</span>
              <span className="text-muted-foreground">{"  ·  "}</span>
              <span className="text-muted-foreground text-xs">
                {timeAgo(entry.timestamp)}
              </span>
            </p>

            {isFailed && entry.failureReason && (
              <div
                className="mt-2 border-l-2 border-l-destructive bg-destructive/3 px-3.5 py-2.5"
                style={{
                  borderRadius: "0 var(--radius-button) var(--radius-button) 0",
                }}
              >
                <span
                  className="text-foreground"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    lineHeight: "1.6",
                  }}
                >
                  {entry.failureReason}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
