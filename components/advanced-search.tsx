"use client";

import {
  Control,
  FieldValues,
  Path,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";
import FormInput from "./form-input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "./form-select";
import { countriesService } from "@/services/countries.service";
import { Icon } from "./icon";
import { CircleFlag } from "react-circle-flags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const defaultSchema = z.object({
  searchValue: z.string().optional(),
  country: z.string().optional(),
});
type SchemaType = z.infer<typeof defaultSchema>;

interface Props<T extends FieldValues> {
  schema: z.ZodObject<Record<keyof T, z.ZodTypeAny>>;
  items: {
    name: Path<T>;
    options: {
      item: React.ReactNode;
      value: string;
    }[];
    placeholder: string;
  }[];
  onSubmit?: (data: SchemaType & T) => void;
  disabled?: boolean;
}

export const AdvancedSearch = <T extends FieldValues>({
  schema,
  items,
  onSubmit,
  disabled,
}: Props<T>) => {
  const combinedSchema = defaultSchema.merge(schema);
  const { control, handleSubmit } = useForm<SchemaType & T>({
    resolver: zodResolver(combinedSchema) as any,
  }) as any as {
    control: Control<SchemaType & T>;
    handleSubmit: UseFormHandleSubmit<SchemaType & T>;
  };

  const handleOnSubmit = (data: SchemaType & T) => {
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <section className="w-full grid grid-cols-1 gap-2 bg-(--bg--base-700) rounded-[0.625rem] p-2.5">
        <div className="flex gap-2 items-stretch">
          <FormInput
            name={"searchValue" as Path<SchemaType & T>}
            type="text"
            id="searchValue"
            placeholder="Search..."
            schema={combinedSchema as any}
            control={control}
            fieldClassName="flex-1 max-w-[31.8125rem]"
          />
          <FormSelect
            name={"country" as Path<SchemaType & T>}
            id="country"
            placeholder="Select country..."
            schema={combinedSchema as any}
            control={control}
            fieldClassName="max-w-[10.9375rem]"
            anchorWidth={false}
            defaultValue="all"
            items={[
              {
                item: (
                  <div className="flex items-center gap-2">
                    <Icon
                      name="global-line"
                      color="var(--icon--strong-950)"
                      size={20}
                    />
                    All Countries
                  </div>
                ),
                value: "all",
              },
              ...countriesService.getCountries().map((country) => ({
                item: (
                  <div className="flex items-center gap-2">
                    <CircleFlag countryCode={country.code} className="size-5" />
                    {country.name}
                  </div>
                ),
                value: country.code,
              })),
            ]}
          />
        </div>
        <Accordion>
          <AccordionItem className="bg-muted rounded-[0.375rem]">
            <AccordionTrigger className="flex items-center gap-2 p-2 hover:no-underline cursor-pointer">
              <Icon
                name="menu-search-line"
                color="var(--icon--strong-950)"
                size={20}
              />
              <span className="label-small text-black">Advanced Search</span>
              <span className="text-xs/5 text-(--text--sub-600)">
                Click here for a more advanced search
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <div className="grid grid-cols-4 gap-2">
                {items.map((item) => (
                  <FormSelect
                    key={item.name}
                    name={item.name as unknown as Path<SchemaType & T>}
                    id={item.name}
                    placeholder={item.placeholder}
                    schema={combinedSchema as any}
                    control={control}
                    items={item.options}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          variant="outline"
          className="w-full bg-white border-(--stroke--strong-950) text-foreground"
          type="submit"
          disabled={disabled}
        >
          Search
        </Button>
      </section>
    </form>
  );
};
