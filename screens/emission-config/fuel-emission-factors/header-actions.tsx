"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddFuelFactorDialog } from "./add-fuel-factor";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions onAdd={() => setOpen(true)} addLabel="Add fuel factor" />
      <AddFuelFactorDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
