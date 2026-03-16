"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ManageUserDialog } from "./users/dialog";

export const AddUser = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon name="add-large-fill" />
        Add User
      </Button>
      <ManageUserDialog task="add" open={open} onOpenChange={setOpen} />
    </>
  );
};
