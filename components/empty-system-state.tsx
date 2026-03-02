import Image from "next/image";
import React from "react";
import { Button, ButtonProps } from "./ui/button";

interface Props {
  handleAddNew: () => void;
  imageSrc: string;
  imageAlt: string;
  label: string;
  buttonChildren: React.ReactNode;
  buttonProps?: Omit<ButtonProps, "onClick" | "children">;
  width: number;
  height: number;
}

export const EmptySystemState = ({
  handleAddNew,
  imageSrc,
  imageAlt,
  label,
  buttonChildren,
  buttonProps,
  width,
  height,
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center py-10">
      <Image width={width} height={height} src={imageSrc} alt={imageAlt} />
      <p className="text-sm/5 font-medium">{label}</p>
      <Button onClick={handleAddNew} {...buttonProps}>
        {buttonChildren}
      </Button>
    </div>
  );
};
