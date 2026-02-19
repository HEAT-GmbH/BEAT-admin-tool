import React from "react";
import { ICONS_REGISTRY } from "@/constants/icons-registry";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof ICONS_REGISTRY;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: number | string;
  color?:
    | (
        | "var(--icon--sub-600)"
        | "var(--primary-green)"
        | "var(--icon--soft-400)"
        | "var(--icon--strong-950)"
        | "var(--icon--disabled-300)"
      )
    | (string & {});
  className?: string; // Explicitly adding for clarity, though HTMLAttributes covers it
}

export const Icon = ({
  name,
  size,
  color,
  className,
  style,
  ...props
}: IconProps) => {
  const iconMarkup = ICONS_REGISTRY[name];

  if (!iconMarkup) {
    console.warn(`Icon "${name}" not found in registry.`);
    return null;
  }

  const applyColor = color || "currentColor";

  // Ensure the SVG scales to the container dimensions by replacing fixed width/height with 100%
  // Also apply color to fill/stroke if they are not "none", preserving "none" values
  const svgContent = iconMarkup
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, 'height="100%"')
    .replace(/fill="([^"]*)"/g, (match, value) =>
      value === "none" ? match : `fill="${applyColor}"`,
    )
    .replace(/stroke="([^"]*)"/g, (match, value) =>
      value === "none" ? match : `stroke="${applyColor}"`,
    );

  // Logic for sizing:
  // 1. If `size` prop is provided, we use inline styles (highest priority).
  // 2. If no `size` prop, we default to Tailwind classes `w-5 h-5` via cn().
  // 3. User can override default classes by passing `className` (e.g., `w-8 h-8`).
  // 4. Inline styles from `size` will strictly override Tailwind width/height classes.

  const finalStyle = size ? { width: size, height: size, ...style } : style;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 w-5 h-5",
        className,
      )}
      style={finalStyle}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
};
