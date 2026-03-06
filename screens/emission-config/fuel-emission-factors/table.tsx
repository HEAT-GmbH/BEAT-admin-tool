"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useFuelEmissionFactorsContext } from "./context";
import { ViewGridFactorDialog } from "./view-fuel-factor-dialog";
import { FuelEmissionFactor } from "@/models/fuel-emission-factor";

const columns: ColumnDef<FuelEmissionFactor>[] = [
  {
    accessorKey: "type",
    header: "Fuel Type",
    cell: ({ row }) => <span className="font-medium">{row.original.type}</span>,
  },
  {
    accessorKey: "emissionFactor",
    header: "Emission Factor",
  },
  {
    accessorKey: "unit",
    header: "Unit of Measure",
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useFuelEmissionFactorsContext();
  const [selected, setSelected] = useState<FuelEmissionFactor | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewGridFactorDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
