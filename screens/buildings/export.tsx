import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export const ExportButton = () => {
  return (
    <Button
      variant="outline"
      className="rounded-[0.625rem] p-2.5 bg-transparent"
    >
      <Icon name="export-line" />
      Export
    </Button>
  );
};
