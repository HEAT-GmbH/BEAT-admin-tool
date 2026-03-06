"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useGridEmissionFactorsContext } from "./context";
import { ViewGridFactorDialog } from "./view-grid-factor-dialog";
import { GridEmissionFactor } from "@/models/grid-emission-factor";
import { countriesService } from "@/services/countries.service";

const columns: ColumnDef<GridEmissionFactor>[] = [
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="font-medium">
        {countriesService.getName(row.original.country)}
      </span>
    ),
  },
  {
    id: "gridFactor",
    header: "Grid Factor",
    cell: ({ row }) => row.original.gridFactors[0]?.gridFactor,
  },
  {
    id: "unit",
    header: "Unit of measure",
    cell: ({ row }) => row.original.gridFactors[0]?.unit,
  },
  {
    id: "activeYear",
    header: "Active Year",
    cell: ({ row }) => row.original.gridFactors[0]?.year,
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useGridEmissionFactorsContext();
  const [selected, setSelected] = useState<GridEmissionFactor | null>(null);

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
