"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddCoolingSystemDialog } from "./add";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add cooling system"
      />
      <AddCoolingSystemDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
