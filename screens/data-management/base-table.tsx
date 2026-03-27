"use client";

import { DataTable } from "@/components/data-table";
import { InputWithIcon } from "@/components/input-with-icon";
import { Pagination } from "@/components/pagination";
import { usePaginationTable } from "@/hooks/use-pagination-table";
import { BasePaginatedResponse, BasePaginatedTable } from "@/models/common";
import { ColumnDef } from "@tanstack/react-table";

interface BaseTableProps<T> {
  queryKey: string;
  queryFn: (
    params: BasePaginatedTable,
  ) => Promise<BasePaginatedResponse<T> | null>;
  columns: ColumnDef<T>[];
  children?: React.ReactNode;
}

export const BaseTable = <T,>({
  queryKey,
  queryFn,
  columns,
  children,
}: BaseTableProps<T>) => {
  const {
    items,
    setSearchValue,
    totalPages,
    isLoading,
    currentPage,
    onNextPage,
    onPreviousPage,
    setCurrentPage,
  } = usePaginationTable({
    queryKey,
    queryFn,
  });

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-4">
        <InputWithIcon
          placeholder="Search"
          startIcon="search-2-line"
          onChange={(e) => setSearchValue(e.target.value)}
          groupClassName="max-w-sm"
        />
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <div className="grid overflow-x-auto">
        <DataTable columns={columns} data={items || []} isLoading={isLoading} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </section>
  );
};
