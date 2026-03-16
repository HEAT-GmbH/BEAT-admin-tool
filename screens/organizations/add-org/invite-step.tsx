"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AddOrgData, inviteUserSchema } from "../schema";
import { useEffect, useEffectEvent } from "react";

export const InviteStep = () => {
  const { control } = useFormContext<AddOrgData>();
  const { fields, append } = useFieldArray({
    control,
    name: "invites",
  });

  const init = useEffectEvent(() => {
    if (fields.length !== 3) {
      append({ email: "", role: "" });
      append({ email: "", role: "" });
      append({ email: "", role: "" });
    }
  });
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-(--text--strong-950)">
          Add users
        </h3>
        <p className="text-xs text-(--text--sub-600)">
          Invite users to this organization.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-2 items-start">
            <FormInput
              name={`invites.${index}.email`}
              id={`invite-email-${index}`}
              label={index === 0 ? "Email address" : undefined}
              placeholder="hello@beat.com"
              control={control}
              schema={inviteUserSchema}
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FormSelect
                  name={`invites.${index}.role`}
                  id={`invite-role-${index}`}
                  label={index === 0 ? "Role" : undefined}
                  placeholder="Select a role"
                  control={control}
                  schema={inviteUserSchema}
                  items={[
                    { value: "admin", item: "Admin" },
                    { value: "data_manager", item: "Data Manager" },
                    { value: "viewer", item: "Viewer" },
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
