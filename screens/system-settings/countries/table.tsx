"use client";
import { CountrySetting } from "@/models/country-setting";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useCountriesContext } from "./context";
import { ViewDetailsDialog } from "./view-details-dialog";

const columns: ColumnDef<CountrySetting>[] = [
  {
    accessorKey: "name",
    header: "Country",
    cell: ({ row }) => {
      const country = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium label-small text-(--text--strong-950)">
            {country.name}
          </span>
          <span className="paragraph-small text-(--text--sub-600)">
            Added on {country.addedOn}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "citiesCount",
    header: "No. Cities",
    cell: ({ row }) => (
      <span className="paragraph-small text-foreground">
        {row.original.citiesCount}
      </span>
    ),
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useCountriesContext();
  const [selected, setSelected] = useState<CountrySetting | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewDetailsDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
