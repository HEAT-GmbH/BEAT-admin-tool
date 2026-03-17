"use client";

import FormInput from "@/components/form-input";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChipList } from "@/screens/components/chip-list";
import { SSDialog } from "@/screens/components/dialog";
import { LabelWithDesc } from "@/screens/components/label-with-desc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";

const addSubTypeAndRefrigerantSchema = z.object({
  subType: z.optional(z.string().min(1, "Name is required")),
  refrigerant: z.optional(z.string().min(1, "Name is required")),
});

const hasSubTypeSchema = z.object({
  subTypes: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      isActive: z.boolean(),
    }),
  ),
  refrigerants: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      isActive: z.boolean(),
    }),
  ),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  hasSubType: z.union([z.literal("Yes"), z.literal("No")]),
  data: z.discriminatedUnion("hasSubType", [
    z.object({
      hasSubType: z.literal("Yes"),
      ...hasSubTypeSchema.shape,
    }),
    z.object({
      hasSubType: z.literal("No"),
    }),
  ]),
});

type AddCoolingSystemData = z.infer<typeof schema>;

interface AddCoolingSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCoolingSystemDialog = ({
  open,
  onOpenChange,
}: AddCoolingSystemDialogProps) => {
  const { reset, handleSubmit, control, setValue, ...methods } = useForm({
    resolver: zodResolver(schema),
  });
  const {
    fields: subTypes,
    append: appendSubType,
    remove: removeSubType,
  } = useFieldArray({
    control,
    name: "data.subTypes",
  });
  const {
    fields: refrigerants,
    append: appendRefrigerant,
    remove: removeRefrigerant,
  } = useFieldArray({
    control,
    name: "data.refrigerants",
  });

  const hasSubType = useWatch({
    control,
    name: "hasSubType",
  });

  const {
    control: addControl,
    reset: addReset,
    getValues: getAddValues,
    ...addMethods
  } = useForm({
    resolver: zodResolver(addSubTypeAndRefrigerantSchema),
  });

  const onSubmit = (data: AddCoolingSystemData) => {
    console.log("Submit fuel factor:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Cooling System"
      description="Complete the input form below to add a new type of cooling system."
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider
        handleSubmit={handleSubmit}
        control={control}
        reset={reset}
        setValue={setValue}
        {...methods}
      >
        <form
          id="add-climate-type-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <FormInput
                id="name"
                label="Cooling System"
                placeholder="Enter cooling system name"
                control={control}
                schema={schema}
                name="name"
              />
              <Field>
                <FieldLabel>
                  Does cooling system have sub-types?{" "}
                  <span className="text-(--state--error--base)">*</span>
                </FieldLabel>
                <RadioGroup
                  value={hasSubType}
                  onValueChange={(value) => setValue("hasSubType", value)}
                >
                  {["Yes", "No"].map((item) => (
                    <Field orientation="horizontal">
                      <RadioGroupItem id={`hasSubType-${item}`} value={item} />
                      <FieldLabel htmlFor={`hasSubType-${item}`}>
                        {item}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </Field>
              {hasSubType && (
                <FormProvider
                  control={addControl}
                  reset={addReset}
                  getValues={getAddValues}
                  {...addMethods}
                >
                  <form
                    id="add-sub-type-and-refrigerant-form"
                    className="flex flex-col h-full overflow-hidden"
                  >
                    <LabelWithDesc
                      className="my-4"
                      label="Cooling system sub-type"
                      description="Enter name of cooling sub-type here"
                    />
                    <div className="space-y-4">
                      <div className="flex items-end justify-between gap-2.5">
                        <FormInput
                          id="subType"
                          label="Cooling sub-type name"
                          placeholder="Enter sub-type name"
                          control={addControl}
                          schema={addSubTypeAndRefrigerantSchema}
                          name="subType"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 max-w-20"
                          onClick={() => {
                            const subType = getAddValues("subType");
                            if (subType) {
                              appendSubType({ name: subType, isActive: true });
                              addReset();
                            }
                          }}
                        >
                          <Icon
                            name="add-large-fill"
                            className="h-5 w-5 text-(--icon--sub-600)"
                          />
                          Add
                        </Button>
                      </div>
                      <ChipList list={subTypes} onRemove={removeSubType} />
                    </div>
                    <LabelWithDesc
                      className="my-4"
                      label="Type of refrigerants"
                      description="Add refrigerants to your cooling system below"
                    />
                    <div className="space-y-4">
                      <div className="flex items-end justify-between gap-2.5">
                        <FormInput
                          id="refrigerant"
                          label="Refrigerant name"
                          placeholder="Enter refrigerant name"
                          control={addControl}
                          schema={addSubTypeAndRefrigerantSchema}
                          name="refrigerant"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 max-w-20"
                          onClick={() => {
                            const refrigerant = getAddValues("refrigerant");
                            if (refrigerant) {
                              appendRefrigerant({
                                name: refrigerant,
                                isActive: true,
                              });
                              addReset();
                            }
                          }}
                        >
                          <Icon
                            name="add-large-fill"
                            className="h-5 w-5 text-(--icon--sub-600)"
                          />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {refrigerants.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 bg-muted px-2 py-1 rounded-[0.375rem]"
                          >
                            {field.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRefrigerant(index)}
                            >
                              <Icon
                                name="close-line"
                                className="h-5 w-5 text-(--icon--sub-600)"
                              />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
