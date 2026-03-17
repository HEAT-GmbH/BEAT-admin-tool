"use client";

import FormInput from "@/components/form-input";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Climate type is required"),
  description: z.string().min(1, "Description is required"),
});

type AddClimateData = z.infer<typeof schema>;

interface AddClimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClimateDialog = ({
  open,
  onOpenChange,
}: AddClimateDialogProps) => {
  const { reset, handleSubmit, control, ...methods } = useForm<AddClimateData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      description: "",
    },
  });

  const onSubmit = (data: AddClimateData) => {
    console.log("Submit climate type:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add climate type"
      description="Add climate classifications for building assessments"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider
        handleSubmit={handleSubmit}
        control={control}
        reset={reset}
        {...methods}
      >
        <form
          id="add-climate-type-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <FormInput
              name="type"
              label="Climate type"
              placeholder="Enter climate type"
              control={control}
              schema={schema}
              id="type"
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Enter description"
              control={control}
              schema={schema}
              id="description"
              type="textarea"
            />
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
