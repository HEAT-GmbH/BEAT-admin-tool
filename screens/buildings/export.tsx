"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { useState } from "react";
import { apiService } from "@/services/api.service";
import { useBuildingContext } from "./building.context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ExportButton = () => {
  const { searchValue, draft, country, climateZone, organisation } =
    useBuildingContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await apiService.exportBuildings({
        search: searchValue || undefined,
        draft:
          draft !== null && draft !== undefined ? String(draft) : undefined,
        country: country || undefined,
        climateZone: climateZone || undefined,
        organisation: organisation || undefined,
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-[0.625rem] p-2.5 bg-transparent"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon name="export-line" />
      )}
      Export
    </Button>
  );
};
