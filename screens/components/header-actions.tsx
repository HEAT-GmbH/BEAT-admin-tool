"use client";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

interface Props {
  onImport?: () => void;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

export const SSHeaderActions = ({
  onImport,
  onExport,
  onAdd,
  addLabel,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="h-10 px-4 text-(--text--sub-600)"
        onClick={onImport}
      >
        <Icon name="import-line" size={20} />
        Import
      </Button>
      <Button
        variant="outline"
        className="h-10 px-4 text-(--text--sub-600)"
        onClick={onExport}
      >
        <Icon name="export-line" size={20} />
        Export
      </Button>
      <Button className="h-10 px-4" onClick={onAdd}>
        <Icon name="add-large-fill" size={20} />
        {addLabel}
      </Button>
    </div>
  );
};
