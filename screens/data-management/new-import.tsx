"use client";

import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartColumn,
  Flame,
  Leaf,
  LucideIcon,
  Package,
  Settings,
  Wind,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ImportDialog } from "../buildings/import-dialog";

export const NewImport = () => {
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const organisationId = "org_123"; // This would come from context or props in a real app
  
  const items: {
    label: string;
    icon: LucideIcon;
    items: {
      label: string;
      description: string;
      tags: string[];
      icon: LucideIcon;
      color: string;
    }[];
  }[] = [
    {
      label: "Consumption Data",
      icon: ChartColumn,
      items: [
        {
          label: "Energy Consumption",
          description: "Electricity usage per building and reporting period",
          tags: ["kWh", "Scope 2", "Monthly"],
          icon: Zap,
          color: "var(--state--away--base)",
        },
        {
          label: "Fuel Consumption",
          description: "Natural gas, diesel, LPG and other on-site fuels",
          tags: ["m³ / litres", "Scope 1"],
          icon: Flame,
          color: "var(--state--error--base)",
        },
        {
          label: "Refrigerant Consumption",
          description: "Refrigerant top-ups and fugitive gas emission records",
          tags: ["kg", "Scope 1"],
          icon: Wind,
          color: "var(--state--stable--base)",
        },
      ],
    },
    {
      label: "Configuration & Reference Data",
      icon: Settings,
      items: [
        {
          label: "Emission Factors",
          description: "Grid, fuel, and regional emission factor updates",
          tags: ["kgCO₂e/unit", "Admin only"],
          icon: Leaf,
          color: "var(--primary-green)",
        },
        {
          label: "EPD Data",
          description:
            "Environmental Product Declarations for building materials",
          tags: ["kgCO₂e/kg", "Scope 3"],
          icon: Package,
          color: "var(--state--faded--base)",
        },
      ],
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon name="download-2-line" />
        New Import
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="right-side-dialog gap-0">
          <div className="flex items-start justify-between gap-2 w-full p-5">
            <DialogHeader>
              <DialogTitle>New Import</DialogTitle>
              <DialogDescription>
                Select the type of data you're importing.
              </DialogDescription>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <Icon name="close-line" />
            </Button>
          </div>
          <div className="px-5 pb-4 flex-1 space-y-6 overflow-y-auto hide-scrollbar">
            {items.map((group, i) => (
              <div key={i} className="space-y-3 w-full">
                <div className="flex items-center gap-2 text-secondary-foreground">
                  <group.icon size={14} />
                  <span className="text-xs font-medium uppercase">
                    {group.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {group.items.map((item, j) => (
                    <Button
                      key={j}
                      variant="outline"
                      className="flex-col items-start justify-start text-left gap-2 p-4 rad-3 border border-border h-auto"
                      onClick={() => setImportOpen(true)}
                    >
                      <item.icon
                        size={24}
                        style={{ color: item.color }}
                        className="shrink-0 mb-3"
                      />
                      <span className="text-sm font-medium text-foreground mb-1">
                        {item.label}
                      </span>
                      <p className="text-xs text-secondary-foreground mb-3 text-wrap">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.tags.map((tag, k) => (
                          <Badge
                            key={k}
                            variant="outline"
                            className="text-xs text-secondary-foreground rad-1.5!"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <ImportDialog organisationId={organisationId} onOpenChange={setImportOpen} onSuccess={() => {}} />
      </Dialog>
    </>
  );
};
