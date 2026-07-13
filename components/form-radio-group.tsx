import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { isFieldRequired } from "@/lib/helpers";
import * as z from "zod";
import { cn } from "@/lib/utils";

interface Props<T extends FieldValues> {
  items: {
    label: React.ReactNode;
    value: string;
  }[];
  control: Control<T>;
  name: Path<T>;
  schema: z.ZodTypeAny;
  id: string;
  label?: React.ReactNode;
  labelAddon?: React.ReactNode;
  hint?: React.ReactNode;
  fieldRequired?: boolean;
  disabled?: boolean;
  labelContainerClassName?: string;
  fieldClassName?: string;
  orientation?: "horizontal" | "vertical";
}

function FormRadioGroup<T extends FieldValues>({
  items,
  control,
  name,
  schema,
  id,
  label,
  labelAddon,
  hint,
  fieldRequired,
  disabled,
  labelContainerClassName,
  fieldClassName,
  orientation = "horizontal",
}: Props<T>) {
  const isRequired = fieldRequired ?? isFieldRequired(schema, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={fieldClassName}>
          {!!label && (
            <div
              className={cn(
                "flex items-center justify-between gap-1",
                labelContainerClassName,
              )}
            >
              <FieldLabel
                htmlFor={id}
                className="font-medium label-small gap-0.5"
              >
                <span className="text-(--text--strong-950)">{label}</span>
                {isRequired && <span className="text-destructive">*</span>}
              </FieldLabel>
              {labelAddon}
            </div>
          )}
          <RadioGroup
            id={id}
            value={field.value ?? ""}
            onValueChange={(value) => {
              field.onChange(value);
              field.onBlur();
            }}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              orientation === "horizontal" ? "flex flex-row gap-6" : "flex flex-col gap-2",
            )}
          >
            {items.map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioGroupItem value={item.value} />
                <span className="paragraph-small text-(--text--strong-950)">
                  {item.label}
                </span>
              </label>
            ))}
          </RadioGroup>
          {hint}
          {fieldState.invalid && (
            <FieldError className="pt-1" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default FormRadioGroup;
