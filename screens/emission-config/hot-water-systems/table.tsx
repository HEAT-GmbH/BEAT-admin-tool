"use client";
import { SSTable } from "@/screens/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useHotWaterSystemsContext } from "./context";
import { ViewHotWaterSystemDialog } from "./view";
import { HotWaterSystemFactor } from "@/models/hot-water-system";

const columns: ColumnDef<HotWaterSystemFactor>[] = [];

export const Table = () => {
  const { items, isLoading, isFetching } = useHotWaterSystemsContext();
  const [selected, setSelected] = useState<HotWaterSystemFactor | null>(null);

  return (
    <>
      <SSTable
        items={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onSelectedChange={setSelected}
      />
      <ViewHotWaterSystemDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        item={selected}
      />
    </>
  );
};
