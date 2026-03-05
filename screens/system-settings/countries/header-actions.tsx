"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddCountryDialog } from "./add-country";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions onAdd={() => setOpen(true)} addLabel="Add country" />
      <AddCountryDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
