"use client";

import { useActivityLogContext } from "./context";
import { format } from "date-fns";
import { useMemo } from "react";

export const Footer = () => {
  const { totalItems, query } = useActivityLogContext();

  const currentCount = useMemo(() => {
    return (
      query.data?.pages.reduce(
        (acc, page) => acc + (page?.data.length || 0),
        0,
      ) || 0
    );
  }, [query.data]);

  const lastRefreshed = useMemo(() => {
    return format(new Date(), "h:mm:ss a");
  }, [query.dataUpdatedAt]);

  return (
    <div className="px-8 py-3 border-t border-border flex items-center justify-between bg-card shrink-0 sticky bottom-0">
      <p className="text-xs text-secondary-foreground font-medium">
        Showing {currentCount} of {totalItems} events
      </p>
      <p className="text-xs text-muted-foreground">
        Last refreshed at {lastRefreshed}
      </p>
    </div>
  );
};
