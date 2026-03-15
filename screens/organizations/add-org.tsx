"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AddOrgDialog } from "./add-org/index";
import { Icon } from "@/components/icon";

export const AddOrg = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Icon name="add-large-fill" size={18} />
        Add new organization
      </Button>
      <AddOrgDialog
        onOpenChange={setOpen}
        onSuccess={() => {
          setOpen(false);
        }}
      />
    </Dialog>
  );
};
