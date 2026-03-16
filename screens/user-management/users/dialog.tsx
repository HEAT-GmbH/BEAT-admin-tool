"use client";

import { Divider } from "@/components/divider";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { DetailsForm } from "./details-form";
import { RolesForm } from "./roles-form";
import { manageUserSchema } from "./schema";
import { OrganizationUser } from "@/models/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  task: "add" | "view" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: OrganizationUser | null;
}

export const ManageUserDialog = ({ task, open, onOpenChange, user }: Props) => {
  const { control, ...methods } = useForm({
    resolver: zodResolver(manageUserSchema),
    mode: "onBlur",
    defaultValues: {
      userDetails: {
        name: "",
        email: "",
        organization: "",
        countryAccess: "All Countries",
      },
      roles: {
        role: "",
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
    },
  });

  const userDetails = useWatch({ control, name: "userDetails" });
  const roles = useWatch({ control, name: "roles" });

  const userDetailsIsValid =
    manageUserSchema.shape.userDetails.safeParse(userDetails).success;
  const roleIsValid = manageUserSchema.shape.roles.safeParse(roles).success;

  const [step, setStep] = useState<"user" | "role">("user");

  const title =
    task === "add" ? "Add User" : task === "edit" ? "Edit User" : "View User";
  const description =
    task === "add"
      ? "Invite a new user to the system"
      : task === "edit"
        ? "Edit user information"
        : "View user details and permissions";

  const reset = useEffectEvent(() => {
    if (!open) {
      methods.reset();
      setStep("user");
    }
  });
  useEffect(() => {
    reset();
  }, [open]);
  const sync = useEffectEvent(() => {
    if (user && task !== "add") {
      methods.reset({
        userDetails: {
          name: user.name,
          email: user.email,
          organization: user.organization,
          countryAccess: user.countryAccess,
        },
        roles: {
          role: user.role,
          permissions: user.permissions,
        },
      });
    }
    if (!user && task !== "add") {
      methods.reset();
    }
  });
  useEffect(() => {
    sync();
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider control={control} {...methods}>
        <form>
          <DialogContent className="right-side-dialog gap-0">
            <DialogHeader className="flex flex-row items-start justify-between p-5 border-b border-border">
              <div className="flex flex-col gap-1">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <Icon name="close-line" />
              </Button>
            </DialogHeader>
            <div className="flex-1 flex flex-col relative overflow-y-auto hide-scrollbar p-5 pt-0">
              {task === "add" && (
                <AddUserForm
                  step={step}
                  userDetailsIsValid={userDetailsIsValid}
                  roleIsValid={roleIsValid}
                />
              )}
              {task === "edit" && (
                <EditUserForm step={step} setStep={setStep} />
              )}
              {task === "view" && (
                <ViewUserForm step={step} setStep={setStep} />
              )}
            </div>
            <DialogFooter className="p-5 flex flex-row items-center justify-end gap-3 m-0 bg-transparent">
              {(task === "add" || task === "edit") && (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    <Icon name="arrow-left" />
                    {step === "user" ? "Cancel" : "Back"}
                  </Button>
                  <Button
                    onClick={() => {
                      if (step === "user") {
                        setStep("role");
                      } else {
                        onOpenChange(false);
                      }
                    }}
                    disabled={
                      step === "user" ? !userDetailsIsValid : !roleIsValid
                    }
                  >
                    {step === "user"
                      ? "Next"
                      : task === "edit"
                        ? "Save changes"
                        : "Create User"}
                    <Icon name="arrow-right" />
                  </Button>
                </>
              )}
              {task === "view" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      step === "user" ? onOpenChange(false) : setStep("user")
                    }
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() =>
                      step === "role" ? onOpenChange(false) : setStep("role")
                    }
                  >
                    {step === "user" ? "Next" : "Done"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
};

interface FormProps {
  step: "user" | "role";
  setStep: (step: "user" | "role") => void;
}

function Step({
  number,
  label,
  isComplete,
  isActive,
}: {
  number: number;
  label: string;
  isComplete: boolean;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full",
          isActive || isComplete
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-secondary-foreground",
        )}
      >
        {isComplete ? (
          <Icon name="check-line" size={16} />
        ) : (
          <span className="text-base font-medium">{number}</span>
        )}
      </div>
      <span
        className={cn(
          "text-base font-medium",
          isActive ? "text-primary-foreground" : "text-secondary-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function AddUserForm({
  step,
  userDetailsIsValid,
  roleIsValid,
}: Omit<FormProps, "setStep"> & {
  userDetailsIsValid: boolean;
  roleIsValid: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 sticky top-px bg-card py-5 z-10">
        <Step
          number={1}
          label="User Details"
          isComplete={userDetailsIsValid}
          isActive={step === "user"}
        />
        <Divider className="w-8" />
        <Step
          number={2}
          label="Role & Permissions"
          isComplete={roleIsValid}
          isActive={step === "role"}
        />
      </div>
      {step === "user" && <DetailsForm task="add" />}
      {step === "role" && <RolesForm task="add" />}
    </div>
  );
}

function EditUserForm({ step, setStep }: FormProps) {
  return (
    <Tabs
      value={step}
      onValueChange={(value) => setStep(value as "user" | "role")}
      className="gap-0"
    >
      <div className="sticky top-px bg-card py-5 z-10">
        <TabsList>
          <TabsTrigger value="user">User Details</TabsTrigger>
          <TabsTrigger value="role">Role & Permissions</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="user">
        <DetailsForm task="edit" />
      </TabsContent>
      <TabsContent value="role">
        <RolesForm task="edit" />
      </TabsContent>
    </Tabs>
  );
}

function ViewUserForm({ step, setStep }: FormProps) {
  return (
    <Tabs
      value={step}
      onValueChange={(value) => setStep(value as "user" | "role")}
      className="gap-0"
    >
      <div className="sticky top-px bg-card py-5 z-10">
        <TabsList>
          <TabsTrigger value="user">User Details</TabsTrigger>
          <TabsTrigger value="role">Role & Permissions</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="user">
        <DetailsForm task="view" />
      </TabsContent>
      <TabsContent value="role">
        <RolesForm task="view" />
      </TabsContent>
    </Tabs>
  );
}
