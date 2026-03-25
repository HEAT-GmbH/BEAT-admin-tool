"use client";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

type Item<T> = {
  status: string;
} & T;

interface Props<T> {
  items: Item<T>[] | null;
  columns: ColumnDef<Item<T>>[];
  isLoading: boolean;
  isFetching: boolean;
  onSelectedChange: (item: Item<T> | null) => void;
}

export const SSTable = <T,>({
  items,
  columns,
  isLoading,
  isFetching,
  onSelectedChange,
}: Props<Item<T>>) => {
  const cols: ColumnDef<Item<T>>[] = [
    ...columns,
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className="text-xs text-(text--sub-600) min-h-6 p-1 pr-2 rounded-[0.375rem] border-border"
          >
            {status?.toLowerCase() === "active" ? (
              <Icon
                name="select-box-circle-fill"
                color="var(--state--success--base)"
                size={16}
              />
            ) : (
              <Icon
                name="forbid-fill"
                color="var(--state--faded--base)"
                size={16}
              />
            )}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ cell }) => (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => onSelectedChange(cell.row.original)}
          >
            <Icon name="eye-line" className="h-5 w-5 text-(--icon--sub-600)" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !items) {
    return (
      <div className="w-full h-60 grid place-items-center">
        <Loader size={56} />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-(--text--sub-600)">
        No climate types found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto hide-scrollbar w-full grid grid-cols-1">
      <DataTable columns={cols} data={items} isLoading={isFetching} />
    </div>
  );
};
