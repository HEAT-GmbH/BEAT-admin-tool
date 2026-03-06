"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddLightingSystemDialog } from "./add";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add lighting system"
      />
      <AddLightingSystemDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
