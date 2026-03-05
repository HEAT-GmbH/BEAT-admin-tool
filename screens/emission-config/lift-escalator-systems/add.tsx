"use client";

import FormInput from "@/components/form-input";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type AddLiftEscalatorSystemData = z.infer<typeof schema>;

interface AddLiftEscalatorSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLiftEscalatorSystemDialog = ({
  open,
  onOpenChange,
}: AddLiftEscalatorSystemDialogProps) => {
  const { reset, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: AddLiftEscalatorSystemData) => {
    console.log("Submit lift escalator system:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Lift & Escalator System"
      description="Complete the input form below to add a new type of lift escalator system."
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        id="add-lift-escalator-system-form"
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <FormInput
            id="name"
            schema={schema}
            control={control}
            name="name"
            label="Lift/Escalator system"
            placeholder="Enter lift/escalator system name"
          />
        </div>
      </form>
    </SSDialog>
  );
};
