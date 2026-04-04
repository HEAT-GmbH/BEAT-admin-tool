"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/form-select";
import FormInput from "@/components/form-input";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";

const schema = z.object({
  buildings: z.string(),
  timeRange: z.object({
    from: z.string(),
    to: z.string(),
  }),
  dataType: z.string(),
  format: z.union([z.literal("PDF"), z.literal("XLSX"), z.literal("CSV")]),
});

type Schema = z.infer<typeof schema>;

export const NewExport = () => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      buildings: "all",
      timeRange: {
        from: "",
        to: "",
      },
      dataType: "Energy Consumption",
      format: "PDF",
    },
  });

  const onSubmit = (data: Schema) => {
    console.log(data);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Icon name="export-line" />
        New Export
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="gap-0">
            <SheetHeader>
              <SheetTitle>New Export</SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col gap-5 border-y border-border px-5 py-4 overflow-y-auto">
              <FormSelect
                id="buildings"
                name="buildings"
                control={control}
                schema={schema}
                label="Buildings"
                items={[
                  { value: "all", item: "All Buildings" },
                  ...["Office Tower A", "Warehouse B", "Retail Complex C"].map(
                    (item) => ({ value: item, item }),
                  ),
                ]}
              />
              <div className="grid grid-cols-2 gap-4 h-fit">
                <FormInput
                  id="timeRange.from"
                  name="timeRange.from"
                  control={control}
                  schema={schema}
                  label="From"
                  type="date"
                />
                <FormInput
                  id="timeRange.to"
                  name="timeRange.to"
                  control={control}
                  schema={schema}
                  label="To"
                  type="date"
                />
              </div>
              <FormSelect
                id="dataType"
                name="dataType"
                control={control}
                schema={schema}
                label="Data Type"
                items={[
                  "Energy Consumption",
                  "Fuel Consumption",
                  "Refrigerant Consumption",
                  "Emission Factors",
                  "EPD Data",
                ].map((item) => ({ value: item, item }))}
              />
              <Controller
                control={control}
                name="format"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Format</FieldLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {(["PDF", "XLSX", "CSV"] as const).map((item) => (
                        <Button
                          key={item}
                          variant="outline"
                          onClick={() => field.onChange(item)}
                          className={cn(
                            "h-9 text-sm",
                            field.value === item &&
                              "bg-(--neutral--black--0)! border-(--neutral--black--0) text-white!",
                          )}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </Field>
                )}
              />
            </div>
            <SheetFooter>
              <Button>Generate Export</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </>
  );
};
