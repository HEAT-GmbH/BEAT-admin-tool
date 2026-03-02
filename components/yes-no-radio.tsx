"use client";

import React from "react";
import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form";
import * as z from "zod";
import { Field, FieldLabel } from "./ui/field";
import { isFieldRequired } from "@/lib/helpers";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  id: string;
  label: React.ReactNode;
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  fieldRequired?: boolean;
}

export const YesNoRadio = <T extends FieldValues>({
  control,
  name,
  schema,
  id,
  label,
  fieldRequired,
}: Props<T>) => {
  const isRequired = fieldRequired ?? isFieldRequired(schema, name);
  const {
    field: { onChange },
  } = useController<T>({ control, name });

  const val = useWatch({ control, name });

  return (
    <Field>
      <FieldLabel
        htmlFor={id}
        className="label-small text-(--text--strong-950) gap-0.5"
      >
        {label}
        {!!isRequired && <span className="text-destructive">*</span>}
      </FieldLabel>
      <RadioGroup
        className="flex items-center gap-3"
        value={val}
        onValueChange={(value) => onChange(value as T[Path<T>])}
      >
        {[
          {
            value: true,
            label: "Yes",
          },
          {
            value: false,
            label: "No",
          },
        ].map((item) => (
          <Field orientation="horizontal" className="w-fit">
            <RadioGroupItem
              key={`${id}-${item.value}`}
              value={item.value}
              id={id + `-${item.value}`}
            />
            <FieldLabel htmlFor={id + `-${item.value}`}>
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </Field>
  );
};
