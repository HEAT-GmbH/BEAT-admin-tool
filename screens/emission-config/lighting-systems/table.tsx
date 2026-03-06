"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLightingSystemsContext } from "./context";
import { ViewLightingSystemDialog } from "./view";
import { LightingSystemFactor } from "@/models/lighting-system";

const columns: ColumnDef<LightingSystemFactor>[] = [
  {
    accessorKey: "name",
    header: "Lighting bulb type",
    cell: ({ row }) => <span className="text-medium">{row.original.name}</span>,
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useLightingSystemsContext();
  const [selected, setSelected] = useState<LightingSystemFactor | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewLightingSystemDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
