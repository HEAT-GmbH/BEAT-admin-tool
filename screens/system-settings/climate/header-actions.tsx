"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddClimateDialog } from "./add-climate-dialog";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add climate type"
      />
      <AddClimateDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
