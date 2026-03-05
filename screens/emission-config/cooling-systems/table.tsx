"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useCoolingSystemsContext } from "./context";
import { ViewCoolingSystemDialog } from "./view";
import { CoolingSystemFactor } from "@/models/cooling-system";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<CoolingSystemFactor>[] = [
  {
    accessorKey: "name",
    header: "Cooling System",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "subType",
    header: "Sub Type",
    cell: ({ row }) => {
      const item = row.original.subTypes;
      const firstTwo = item.slice(0, 2);
      const remainderCount = item.length - 2;
      return (
        <div className="flex items-center gap-2">
          {firstTwo.map((subType) => (
            <Badge
              key={subType.name}
              className="bg-(--state--information--lighter) h-5 px-2"
            >
              {subType.name}
            </Badge>
          ))}
          {remainderCount > 0 && (
            <Badge className="bg-(--state--faded--lighter) text-(--state--faded--base) h-5 px-2">
              +{remainderCount}
            </Badge>
          )}
        </div>
      );
    },
  },
];

export const Table = () => {
  const { items, isLoading, isFetching } = useCoolingSystemsContext();
  const [selected, setSelected] = useState<CoolingSystemFactor | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewCoolingSystemDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
