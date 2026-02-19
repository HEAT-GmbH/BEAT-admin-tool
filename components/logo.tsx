import Image, { ImageProps } from "next/image";

export const Logo = ({
  width = 45,
  height = 18,
  ...props
}: Omit<ImageProps, "src" | "alt">) => {
  return (
    <Image
      src="/logo.svg"
      alt="logo"
      width={width}
      height={height}
      {...props}
    />
  );
};
