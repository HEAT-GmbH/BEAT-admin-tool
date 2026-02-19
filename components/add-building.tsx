import { Button } from "./ui/button";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const AddBuilding = ({ className }: { className?: string }) => {
  return (
    <Link href="/add-building" prefetch>
      <Button className={cn("rounded-[0.625rem] p-2.5", className)}>
        <Icon name="add-large-fill" />
        Add Building
      </Button>
    </Link>
  );
};
