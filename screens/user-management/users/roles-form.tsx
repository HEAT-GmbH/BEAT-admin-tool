"use client";

import FormSelect from "@/components/form-select";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ROLE_OPTIONS } from "@/constants/select-options";
import { Shield } from "lucide-react";
import { Path, useFormContext, useWatch } from "react-hook-form";
import { PermissionsTable } from "../permissions-table";
import { ManageUser, manageUserSchema } from "./schema";

type Permission = ManageUser["roles"]["permissions"];

interface Props {
  task: "add" | "view" | "edit";
}

export const RolesForm = ({ task }: Props) => {
  const { control, setValue } = useFormContext<ManageUser>();

  const selectedRole = useWatch({ control, name: "roles.role" });
  const permissions = useWatch({ control, name: "roles.permissions" });

  const data: { key: keyof Permission; control: Path<ManageUser> }[] = [
    { key: "buildings", control: "roles.permissions.buildings" },
    { key: "emissionConfig", control: "roles.permissions.emissionConfig" },
    { key: "users", control: "roles.permissions.users" },
    { key: "reports", control: "roles.permissions.reports" },
    { key: "dashboard", control: "roles.permissions.dashboard" },
    { key: "dataManagement", control: "roles.permissions.dataManagement" },
    { key: "organizations", control: "roles.permissions.organizations" },
    { key: "systemSettings", control: "roles.permissions.systemSettings" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <RadioGroup
        name="roles.role"
        value={selectedRole}
        onValueChange={(value) => {
          console.log(value);
        }}
      >
        <FormSelect
          control={control}
          name="roles.role"
          schema={manageUserSchema}
          id="role"
          label={
            <div className="flex items-center gap-2 text-foreground">
              <Shield /> {task === "add" ? "Define Role" : "Role"}
            </div>
          }
          placeholder="Select role"
          transformValue={(value) => {
            return (
              ROLE_OPTIONS.find((role) => role.value === value)?.label ?? value
            );
          }}
          readOnly={task === "view"}
          items={ROLE_OPTIONS.map((role) => ({
            value: role.value,
            item: (
              <div className="flex items-center gap-2">
                <RadioGroupItem value={role.value} />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">{role.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {role.description}
                  </span>
                </div>
              </div>
            ),
          }))}
        />
      </RadioGroup>
      <Field>
        <FieldLabel className="inline-flex items-center justify-between">
          Permissions
          <span className="text-secondary-foreground text-xs">
            Toggle to customise
          </span>
        </FieldLabel>
        <PermissionsTable
          data={data}
          task={task}
          permissions={permissions}
          setValue={(path, value) => setValue(path as Path<ManageUser>, value)}
        />
      </Field>
    </div>
  );
};
