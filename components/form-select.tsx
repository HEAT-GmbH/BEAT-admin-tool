import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { isFieldRequired } from "@/lib/helpers";
import * as z from "zod";
import { Icon } from "./icon";
import { IconName } from "@/models/icons";
import { cn } from "@/lib/utils";

interface Props<T extends FieldValues> {
  items: {
    item: React.ReactNode;
    value: string;
  }[];
  control: Control<T>;
  name: Path<T>;
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  id: string;
  label?: React.ReactNode;
  placeholder: string;
  defaultValue?: string;
  labelAddon?: React.ReactNode;
  hint?: React.ReactNode;
  fieldRequired?: boolean;
  startIcon?: IconName;
  disabled?: boolean;
  labelContainerClassName?: string;
  fieldClassName?: string;
  anchorWidth?: boolean;
}

function FormSelect<T extends FieldValues>({
  items,
  control,
  name,
  schema,
  id,
  label,
  placeholder,
  defaultValue,
  labelAddon,
  hint,
  fieldRequired,
  startIcon,
  disabled,
  labelContainerClassName,
  fieldClassName,
  anchorWidth,
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
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              field.onBlur();
            }}
            value={field.value ?? ""}
            defaultValue={defaultValue}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              aria-invalid={fieldState.invalid}
              className="h-10!"
            >
              {!!startIcon && (
                <Icon name={startIcon} className="text-(--icon--soft-400)" />
              )}
              <SelectValue placeholder={placeholder}>
                {(value: string) =>
                  items.find((item) => item.value === value)?.item ?? (
                    <span className="text-(--text--soft-400) paragraph-small font-normal">
                      {placeholder}
                    </span>
                  )
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent anchorWidth={anchorWidth}>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hint}
          {fieldState.invalid && (
            <FieldError className="pt-1" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default FormSelect;
