"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddHotWaterSystemDialog } from "./add";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add hot water system"
      />
      <AddHotWaterSystemDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
