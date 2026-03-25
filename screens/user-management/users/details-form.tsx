"use client";

import FormInput from "@/components/form-input";
import { useController, useFormContext } from "react-hook-form";
import { ManageUser, manageUserSchema } from "./schema";
import FormSelect from "@/components/form-select";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { Icon } from "@/components/icon";
import { countriesService } from "@/services/countries.service";
import { CircleFlag } from "react-circle-flags";
import { Field, FieldLabel } from "@/components/ui/field";

const organizations = [
  {
    "id": "1",
    "name": "Acme Corp",
  },
  {
    "id": "2",
    "name": "Global Industries",
  },
  {
    "id": "3",
    "name": "TechStart Inc",
  },
].map((org) => ({
  value: org.id,
  item: org.name,
}));

interface Props {
  task: "add" | "view" | "edit";
}

export const DetailsForm = ({ task }: Props) => {
  const { control } = useFormContext<ManageUser>();

  const {
    field: { value: countryAccess, onChange: setCountryAccess },
  } = useController({
    control,
    name: "userDetails.countryAccess",
    defaultValue: "All Countries",
  });

  return (
    <div className="grid grid-cols-1 gap-5">
      <FormInput
        control={control}
        schema={manageUserSchema}
        id="name"
        label="Full Name"
        name="userDetails.name"
        placeholder="eg. John Doe"
        readOnly={task === "view"}
      />
      <FormInput
        control={control}
        schema={manageUserSchema}
        id="email"
        label="Email Address"
        name="userDetails.email"
        placeholder="e.g. john@example.com"
        readOnly={task === "view"}
      />
      <FormSelect
        control={control}
        schema={manageUserSchema}
        id="organization"
        label="Organization"
        name="userDetails.organization"
        placeholder="Select organization..."
        readOnly={task === "view"}
        items={organizations}
      />
      <Field>
        <FieldLabel>Country Access</FieldLabel>
        <VirtualizedCombobox
          options={[
            {
              value: "All Countries",
              label: "All Countries",
              icon: <Icon name="global-line" className="h-4 w-4" />,
            },
            ...countriesService.getCountries().map(({ code, name }) => ({
              value: name,
              label: name,
              icon: <CircleFlag countryCode={code} className="h-4 w-4" />,
            })),
          ]}
          value={countryAccess || "All Countries"}
          onValueChange={(value) => setCountryAccess(value || "All Countries")}
          placeholder="All Countries"
          searchPlaceholder="Search..."
        />
      </Field>
    </div>
  );
};
