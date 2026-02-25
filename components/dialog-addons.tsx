import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

export const DialogDivider = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "px-5 py-1.5 text-[var(--text--soft-400)] bg-muted text-xs/4 -mx-5 uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const DialogAccordion = ({
  children,
  title = "OTHER DETAILS",
  value = "dialog-accordion",
}: PropsWithChildren<{ title?: React.ReactNode; value?: string }>) => {
  return (
    <Accordion className="w-full">
      <AccordionItem value={value}>
        <AccordionTrigger
          className="w-full bg-muted text-foreground text-xs/5 font-semibold rounded-[0.25rem] hover:no-underline p-2.5 items-center"
          iconClassName="text-(--icon--strong-950)!"
        >
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
