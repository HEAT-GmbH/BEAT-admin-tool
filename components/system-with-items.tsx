"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Divider } from "./divider";
import { Icon, IconName } from "./icon";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface Field {
  icon?: IconName;
  id: string;
  title: string;
  description: string[] | ((index: number) => React.ReactNode);
}

interface Props {
  ctaLabel?: string;
  ctaSection?: React.ReactNode;
  handleAddNew?: () => void;
  fieldIcon?: IconName;
  fields: Field[];
  handleEdit: (index: number) => void;
  isEditable?: boolean;
  remove: (index: number) => void;
  systemName: string;
}

export const SystemWithItems = ({
  ctaLabel,
  ctaSection,
  handleAddNew,
  fields,
  handleEdit,
  isEditable = true,
  remove,
  fieldIcon,
  systemName,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {!!ctaSection ? (
          ctaSection
        ) : (
          <Button
            variant="outline"
            className="w-fit border-(--stroke-strong-950)"
            onClick={handleAddNew}
          >
            <Icon name="add-large-fill" size={20} />
            {ctaLabel}
          </Button>
        )}
        <Divider />
        <ul className="grid grid-cols-1 gap-3">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-stretch justify-between gap-1.5 w-full p-2.5 rounded-[0.5rem] bg-muted border border-borber"
            >
              <div className="w-fit">
                {(field.icon || fieldIcon) && (
                  <Icon
                    name={(field.icon ?? fieldIcon) as IconName}
                    size={20}
                    color="var(--icon--strong-950)"
                  />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <p className="label-small font-medium">{field.title}</p>
                <p className="text-sm/5 text-(--text--sub-600) flex gap-2">
                  {Array.isArray(field.description)
                    ? field.description.map((item, index) => (
                        <span
                          key={index}
                          className={cn(
                            "pr-2",
                            index !== field.description.length - 1 &&
                              "border-r border-(--text--sub-600)",
                          )}
                        >
                          {item}
                        </span>
                      ))
                    : field.description(index)}
                </p>
              </div>
              <div className="flex items-center gap-1 w-full">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(index)}
                >
                  <Icon
                    name={isEditable ? "edit-line" : "external-link-line"}
                    size={16}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(index)}
                >
                  <Icon name="delete-bin-5-line" size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-105.5! w-full p-0"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center gap-4 p-5">
            <div className="grid place-items-center shrink-0 size-10 rounded-[0.625rem] bg-(--state--warning--lighter) text-(--state--warning--base)">
              <Icon name="alert-fill" size={24} />
            </div>
            <div className="space-y-1 w-full text-center">
              <h6 className="label-medium font-medium text-foreground">
                Are you sure?
              </h6>
              <p className="paragraph-small text-(--text--sub-600)">
                You are about to remove or delete a added {systemName} system.
                This will action will permanently remove it.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 py-4 px-5 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => remove(deleteIndex!)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
