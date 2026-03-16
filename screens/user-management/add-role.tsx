"use client";

import FormInput from "@/components/form-input";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Permissions } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, useState } from "react";
import { Path, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { PermissionsTable } from "./permissions-table";
import { permissions } from "./users/schema";

const schema = z.object({
  title: z.string().min(1, "Please enter a role title"),
  description: z.string().min(1, "Please enter a description"),
  permissions,
});

type AddRole = z.infer<typeof schema>;

export const AddRole = ({ variant }: { variant: "default" | "outline" }) => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      permissions: {
        buildings: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        emissionConfig: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        users: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        reports: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        dashboard: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        dataManagement: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        organizations: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
        systemSettings: {
          all: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          export: false,
        },
      },
    },
  });

  const permissions = useWatch({ control, name: "permissions" });
  const formValues = useWatch({ control });

  const isFormValid = schema.safeParse(formValues).success;

  const data: { key: keyof Permissions; control: Path<AddRole> }[] = [
    { key: "buildings", control: "permissions.buildings" },
    { key: "emissionConfig", control: "permissions.emissionConfig" },
    { key: "users", control: "permissions.users" },
    { key: "reports", control: "permissions.reports" },
    { key: "dashboard", control: "permissions.dashboard" },
    { key: "dataManagement", control: "permissions.dataManagement" },
    { key: "organizations", control: "permissions.organizations" },
    { key: "systemSettings", control: "permissions.systemSettings" },
  ];

  const onSubmit = (data: AddRole) => {
    console.log(data);
  };

  const resetSync = useEffectEvent(() => {
    if (!open) {
      reset();
    }
  });
  useEffect(() => {
    resetSync();
  }, [open]);

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        <Icon name="add-large-fill" />
        Add Role
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="right-side-dialog gap-0">
            <DialogHeader className="flex flex-row items-start justify-between p-5 border-b border-border">
              <div className="flex flex-col gap-1">
                <DialogTitle>Add Role</DialogTitle>
                <DialogDescription>
                  Create a new role with custom permissions
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <Icon name="close-line" />
              </Button>
            </DialogHeader>
            <div className="flex-1 flex flex-col gap-5 relative overflow-y-auto hide-scrollbar p-5">
              <FormInput
                control={control}
                schema={schema}
                name="title"
                id="title"
                placeholder="e.g. Regional Manager"
                label="Role Title"
              />
              <FormInput
                control={control}
                schema={schema}
                name="description"
                id="description"
                placeholder="e.g. Manages regional operations"
                label="Description"
              />
              <div className="h-fit">
                <PermissionsTable
                  permissions={permissions}
                  task="add"
                  data={data}
                  setValue={(path, value) =>
                    setValue(path as Path<AddRole>, value)
                  }
                />
              </div>
            </div>
            <DialogFooter className="p-5 flex flex-row items-center justify-end gap-3 m-0 bg-transparent">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                Create role
                <Icon name="arrow-right" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};
