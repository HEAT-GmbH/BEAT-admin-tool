"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import useDebounce from "@/hooks/use-debounce";
import { ActivityLogEntry } from "@/models/activity-log";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";

export type Timeline = "24hrs" | "7days" | "30days" | "all";
export type Status = "all" | ActivityLogEntry["status"];
export type Category = "all" | (string & {});

interface ActivityLogsCtxType {
  timeline: Timeline;
  setTimeline: (val: Timeline) => void;
  status: Status;
  setStatus: (val: Status) => void;
  category: Category;
  setCategory: (val: Category) => void;
  search: string;
  setSearch: (val: string) => void;
  query: ReturnType<typeof useInfiniteQuery<any>>;
  totalItems: number;
}

const context = createContext<ActivityLogsCtxType | null>(null);

export const ActivityLogProvider = ({ children }: PropsWithChildren) => {
  const [timeline, setTimeline] = useState<Timeline>("all");
  const [status, setStatus] = useState<Status>("all");
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const query = useInfiniteQuery({
    queryKey: [
      "activity-logs",
      { timeline, status, category, debouncedSearch },
    ],
    queryFn: ({ pageParam = 1 }) =>
      apiService.getActivityLogs({
        timeline,
        status,
        category,
        search: debouncedSearch,
        currentPage: pageParam,
        pageSize: 5,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.data.length < 5) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
  });

  const totalItems = useMemo(() => {
    return query.data?.pages[0]?.totalItems || 0;
  }, [query.data]);

  return (
    <context.Provider
      value={{
        timeline,
        setTimeline,
        status,
        setStatus,
        category,
        setCategory,
        search,
        setSearch,
        query,
        totalItems,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useActivityLogContext = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(
      "useActivityLogContext must be used within an ActivityLogProvider",
    );
  }
  return ctx;
};
