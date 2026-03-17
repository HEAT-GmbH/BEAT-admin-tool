"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useActivityLogContext } from "./context";

export const Actions = () => {
  const {
    query: { refetch, isFetching },
  } = useActivityLogContext();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 text-foreground/80 font-medium shadow-xs"
        onClick={handleRefresh}
        disabled={isFetching}
      >
        <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
        Refresh
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 text-foreground/80 font-medium shadow-xs"
      >
        <Download size={14} />
        Export CSV
      </Button>
    </div>
  );
};
