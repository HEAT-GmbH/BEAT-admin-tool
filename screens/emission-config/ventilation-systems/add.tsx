"use client";

import FormInput from "@/components/form-input";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type AddVentilationSystemData = z.infer<typeof schema>;

interface AddVentilationSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddVentilationSystemDialog = ({
  open,
  onOpenChange,
}: AddVentilationSystemDialogProps) => {
  const { reset, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: AddVentilationSystemData) => {
    console.log("Submit fuel factor:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Ventilation System"
      description="Complete the input form below to add a new type of ventilation system."
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        id="add-ventilation-system-form"
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <FormInput
            id="name"
            schema={schema}
            control={control}
            name="name"
            label="Ventilation system"
            placeholder="Enter ventilation system name"
          />
        </div>
      </form>
    </SSDialog>
  );
};
