"use client";
import { isFieldRequired } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { IconName } from "@/models/icons";
import { Icon } from "./icon";
import { Button } from "./ui/button";

interface Props<T extends FieldValues> extends React.ComponentProps<"input"> {
  control: Control<T>;
  name: Path<T>;
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  id: string;
  label?: string | React.ReactNode;
  placeholder: string;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  startIcon?: IconName;
  endIcon?: IconName;
  inputGroupClassName?: string;
  iconClassName?: string;
  labelAddon?: React.ReactNode;
  hint?: React.ReactNode;
  fieldRequired?: boolean;
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
}

function FormInput<T extends FieldValues>({
  control,
  name,
  schema,
  id,
  label,
  placeholder,
  autoComplete,
  type,
  className,
  startIcon,
  endIcon,
  inputGroupClassName,
  iconClassName,
  labelAddon,
  hint,
  fieldRequired,
  startAddon,
  endAddon,
  ...props
}: Props<T>) {
  const isRequired = fieldRequired ?? isFieldRequired(schema, name);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="relative">
          {label ? (
            <div className="flex items-center justify-between gap-1">
              <FieldLabel
                htmlFor={id}
                className="label-small text-(--text--strong-950) gap-0.5"
              >
                <span>{label}</span>
                {!!isRequired && <span className="text-destructive">*</span>}
              </FieldLabel>
              {labelAddon}
            </div>
          ) : null}
          <InputGroup className={cn("h-10 overflow-hidden", className)}>
            {startIcon || startAddon ? (
              <InputGroupAddon
                className={cn("text-(--icon--soft-400)", iconClassName)}
              >
                {startAddon ? startAddon : <Icon name={startIcon!} />}
              </InputGroupAddon>
            ) : null}
            <InputGroupInput
              id={id}
              name={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="h-full"
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              onChange={(e) => {
                if (type === "file" && e.target.files) {
                  field.onChange(e.target.files);
                } else {
                  field.onChange(e);
                }
              }}
              onBlur={field.onBlur}
              value={type === "file" ? undefined : (field.value ?? "")}
              ref={field.ref}
              {...props}
            />
            {endIcon || type === "password" || endAddon ? (
              <InputGroupAddon
                className={cn("text-(--icon--soft-400)", iconClassName)}
                align="inline-end"
              >
                {type === "password" ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon name={showPassword ? "eye-line" : "eye-off-line"} />
                  </Button>
                ) : endAddon ? (
                  endAddon
                ) : (
                  <Icon name={endIcon!} />
                )}
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          {hint}
          {fieldState.invalid && (
            <FieldError className="pt-1" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default FormInput;
