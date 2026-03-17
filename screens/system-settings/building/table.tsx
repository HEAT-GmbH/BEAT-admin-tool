"use client";
import { BuildingType } from "@/models/building-type";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useBuildingTypesContext } from "./context";
import { ViewBuildingDialog } from "./view-building-dialog";

const columns: ColumnDef<BuildingType>[] = [
  {
    accessorKey: "type",
    header: "Building type",
  },
  {
    accessorKey: "hasSubTypes",
    header: "Has sub types",
    cell: ({ row }) => (
      <span className="font-normal paragraph-small text-foreground">
        {row.original.hasSubTypes ? "Yes" : "No"}
      </span>
    ),
  },
  {
    id: "noOfSubTypes",
    header: "No. of sub types",
    cell: ({ row }) => (
      <span className="font-normal paragraph-small text-foreground">
        {row.original.subTypes.length}
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
