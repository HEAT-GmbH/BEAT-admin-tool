"use client";
import { ClimateType } from "@/models/climate-type";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useClimateTypesContext } from "./context";
import { ViewClimateDialog } from "./view-climate-dialog";

const columns: ColumnDef<ClimateType>[] = [
  {
    accessorKey: "name",
    header: "Climate type",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="font-normal paragraph-small text-foreground">
        {row.original.description}
      </span>
    ),
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useClimateTypesContext();
  const [selected, setSelected] = useState<ClimateType | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewClimateDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
