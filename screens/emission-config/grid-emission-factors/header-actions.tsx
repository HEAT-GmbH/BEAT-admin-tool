"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddGridFactorDialog } from "./add-grid-factor";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions onAdd={() => setOpen(true)} addLabel="Add grid factor" />
      <AddGridFactorDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
