"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddVentilationSystemDialog } from "./add";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add ventilation system"
      />
      <AddVentilationSystemDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
