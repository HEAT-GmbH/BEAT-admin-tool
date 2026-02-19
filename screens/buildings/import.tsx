"use client";
import { Icon, IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Organizations } from "./organizations";
import { Users } from "./users";
import { ImportDialog } from "./import-dialog";

type Tab = "Organizations" | "Users";
const tabs: { icon: IconName; label: Tab }[] = [
  { icon: "building-3-line", label: "Organizations" },
  { icon: "user-6-line", label: "Users" },
];

export const ImportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tab>("Organizations");
  const [organization, setOrganization] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const Comp = activeTab === "Organizations" ? Organizations : Users;

  return (
    <>
      <Button
        variant="outline"
        className="rounded-[0.625rem] p-2.5 bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <Icon name="import-line" />
        Import
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="px-0 max-w-120! h-[95vh] flex flex-col"
          showCloseButton={false}
        >
          <div className="px-6 flex flex-col items-center gap-1 max-w-84.5 mx-auto text-center">
            <h2 className="text-xl font-extrabold text-foreground mt-6">
              Create and Assign building.
            </h2>
            <p className="text-sm/4.5 text-(--text--sub-600)">
              Please select a user or an organization to assign building to when
              created
            </p>
          </div>
          <div className="flex items-start w-full gap-6 h-fit">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={cn(
                  "flex-1 py-3.5 px-4 border-b-2 flex items-center justify-center gap-1.5 text-foreground label-small cursor-pointer",
                  activeTab === tab.label
                    ? "border-primary"
                    : "border-transparent",
                )}
              >
                <Icon name={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-full px-6 pb-6 flex-1 overflow-y-auto no-scrollbar">
            <Comp onOrganizationSelect={setOrganization} />
          </div>
          <div className="flex items-center justify-end gap-2 py-4 px-6">
            <Button
              className="h-9 label-small"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-9 label-small"
              disabled={!organization}
              onClick={() => setShowImportDialog(true)}
            >
              Save & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <ImportDialog
          onOpenChange={setShowImportDialog}
          onSuccess={() => {
            setIsOpen(false);
            setShowImportDialog(false);
          }}
        />
      </Dialog>
    </>
  );
};
