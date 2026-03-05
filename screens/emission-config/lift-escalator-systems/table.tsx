"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLiftEscalatorSystemsContext } from "./context";
import { ViewLiftEscalatorSystemDialog } from "./view";
import { LiftEscalatorSystemFactor } from "@/models/lift-escalator-system";

const columns: ColumnDef<LiftEscalatorSystemFactor>[] = [
  {
    accessorKey: "name",
    header: "Lift/Escalator system",
    cell: ({ row }) => <span className="text-medium">{row.original.name}</span>,
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useLiftEscalatorSystemsContext();
  const [selected, setSelected] = useState<LiftEscalatorSystemFactor | null>(
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
      <ViewLiftEscalatorSystemDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
