"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useVentilationSystemsContext } from "./context";
import { ViewVentilationSystemDialog } from "./view";
import { VentilationSystemFactor } from "@/models/ventilation-system";

const columns: ColumnDef<VentilationSystemFactor>[] = [
  {
    accessorKey: "name",
    header: "Ventilation system",
    cell: ({ row }) => <span className="text-medium">{row.original.name}</span>,
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useVentilationSystemsContext();
  const [selected, setSelected] = useState<VentilationSystemFactor | null>(
    null,
  );

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewVentilationSystemDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
