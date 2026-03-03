"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddBuildingDialog } from "./add-building-dialog";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add building type"
      />
      <AddBuildingDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
