import { IconName } from "@/models/icons";
import { InputHTMLAttributes, RefObject } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Icon } from "./icon";

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
    <InputGroup className={`h-10 overflow-hidden ${groupClassName}`}>
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
