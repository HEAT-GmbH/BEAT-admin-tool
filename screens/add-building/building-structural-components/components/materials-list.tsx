"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Control, useFieldArray, FieldValues, Path } from "react-hook-form";
import { Material, materialSchema } from "../../schema";
import { CircleFlag } from "react-circle-flags";
import Image from "next/image";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onAddFromEpd: () => void;
}

export function MaterialsList<T extends FieldValues>({
  control,
  name,
  onAddFromEpd,
}: Props<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h4 className="label-medium font-bold text-foreground">
            Added Materials
          </h4>
          <p className="text-sm/5 text-(--text--sub-600)">
            Added from EPD libraries
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddFromEpd}
          className="h-9 text-foreground border-foreground"
        >
          <Icon name="add-large-fill" size={20} />
          Add from EPD library
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Image
            src="/structure-materials.png"
            alt="Materials image"
            width={196}
            height={196}
            className="mb-4"
          />
          <p className="text-sm/5 text-(--text--sub-600) max-w-[240px]">
            How would you like to add your building structural components.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onAddFromEpd}
            className="mt-2.5 text-foreground border-foreground"
          >
            Add from EPD library
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2.5">
          {fields.map((field, index) => {
            const materialPath = `${name}.${index}` as Path<T>;
            const materialValue = field as unknown as Material;

            return (
              <li
                key={field.id}
                className="bg-muted rounded-[0.75rem] p-4 space-y-2 border border-border"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm/5 font-medium text-foreground">
                    {materialValue.name}
                  </span>
                  {materialValue.link && (
                    <a
                      href={materialValue.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--icon--sub-600) hover:text-foreground transition-colors"
                    >
                      <Icon name="external-link-line" size={20} />
                    </a>
                  )}
                </div>
                <div className="flex items-stretch gap-1.5 bg-white rounded-[0.75rem] p-2.5 border border-border">
                  <div className="bg-muted px-2 flex items-center shrink-0 rounded-[0.375rem]">
                    {materialValue.country ? (
                      <CircleFlag
                        countryCode={materialValue.country.toLowerCase()}
                        className="size-5"
                      />
                    ) : (
                      <Icon
                        name="global-line"
                        size={20}
                        color="var(--icon--soft-400)"
                      />
                    )}
                  </div>

                  <FormInput
                    control={control}
                    name={`${materialPath}.description` as Path<T>}
                    schema={materialSchema as any}
                    id={`material-${index}-description`}
                    placeholder="Add description"
                    className="flex-1"
                    inputGroupClassName="border-none bg-transparent h-9"
                  />

                  {/* Note: In HTML, some have category select, some don't. 
                      I'll include it based on the schema requirement. */}
                  <FormSelect
                    control={control}
                    name={`${materialPath}.category` as Path<T>}
                    schema={materialSchema as any}
                    id={`material-${index}-category`}
                    placeholder="Category"
                    fieldClassName="w-[12rem]"
                    items={[
                      {
                        value: "mem01",
                        item: "MEM01 - Bottom floor construction",
                      },
                      {
                        value: "mem02",
                        item: "MEM02 - Intermediate floor construction",
                      },
                      { value: "mem04", item: "MEM04 - Roof construction" },
                      { value: "mem05", item: "MEM05 - External walls" },
                      { value: "mem06", item: "MEM06 - Interior walls" },
                      { value: "mem08", item: "MEM08 - Window glazing" },
                      { value: "mem09", item: "MEM09 - Roof insulation" },
                      { value: "mem10", item: "MEM10 - Wall insulation" },
                    ]}
                  />

                  <div className="flex items-center gap-1">
                    <FormInput
                      control={control}
                      name={`${materialPath}.quantity` as Path<T>}
                      schema={materialSchema as any}
                      id={`material-${index}-quantity`}
                      placeholder="Quantity"
                      type="number"
                      className="w-24"
                      inputGroupClassName="border-none bg-transparent h-9"
                    />
                    <FormSelect
                      control={control}
                      name={`${materialPath}.unit` as Path<T>}
                      schema={materialSchema as any}
                      id={`material-${index}-unit`}
                      placeholder="Unit"
                      fieldClassName="w-20"
                      items={[
                        { value: "kg", item: "kg" },
                        { value: "m3", item: "m³" },
                        { value: "pcs", item: "pcs" },
                        { value: "m2", item: "m²" },
                      ]}
                    />
                  </div>

                  <div className="w-px bg-border h-6 self-center" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    className="text-foreground shrink-0"
                  >
                    <Icon name="delete-bin-5-line" size={20} />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
