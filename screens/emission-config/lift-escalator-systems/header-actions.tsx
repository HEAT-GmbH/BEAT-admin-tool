"use client";
import { SSHeaderActions } from "@/screens/components/header-actions";
import { useState } from "react";
import { AddLiftEscalatorSystemDialog } from "./add";

export const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SSHeaderActions
        onAdd={() => setOpen(true)}
        addLabel="Add lift & escalator system"
      />
      <AddLiftEscalatorSystemDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
