"use client";
import { BuildingType } from "@/models/building-type";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useBuildingTypesContext } from "./context";
import { ViewBuildingDialog } from "./view-building-dialog";

const columns: ColumnDef<BuildingType>[] = [
  {
    accessorKey: "name",
    header: "Building type",
  },
  {
    accessorKey: "has_subtypes",
    header: "Has sub types",
    cell: ({ row }) => (
      <span className="font-normal paragraph-small text-foreground">
        {row.original.has_subtypes ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "subtype_count",
    header: "No. of sub types",
    cell: ({ row }) => (
      <span className="font-normal paragraph-small text-foreground">
        {row.original.subtype_count}
      </span>
    ),
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useBuildingTypesContext();
  const [selected, setSelected] = useState<BuildingType | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewBuildingDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
