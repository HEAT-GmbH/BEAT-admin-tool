import { cn } from "@/lib/utils";
import { IconName } from "@/models/icons";
import { InputHTMLAttributes, RefObject } from "react";
import { Icon } from "./icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: IconName;
  endIcon?: IconName;
  groupClassName?: string;
  ref?: RefObject<HTMLInputElement | null>;
}

export const InputWithIcon = ({
  startIcon,
  endIcon,
  groupClassName,
  ref,
  ...props
}: Props) => {
  return (
    <InputGroup className={cn("h-10 overflow-hidden", groupClassName)}>
      {!!startIcon && (
        <InputGroupAddon>
          <Icon name={startIcon} color="var(--icon--soft-400)" />
        </InputGroupAddon>
      )}
      <InputGroupInput ref={ref} {...props} />
      {!!endIcon && (
        <InputGroupAddon align="inline-end">
          <Icon name={endIcon} color="var(--icon--soft-400)" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
