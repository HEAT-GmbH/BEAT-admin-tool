"use client";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { selectColumn } from "@/constants/data-table";
import { Building } from "@/models/building";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { useBuildingContext } from "./building.context";

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const columns: ColumnDef<Building>[] = [
  selectColumn as ColumnDef<Building>,
  {
    accessorKey: "name",
    header: "Building name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const { city, country } = row.original;
      const parts = [city?.name, country?.name].filter(Boolean);
      return <span>{parts.length > 0 ? parts.join(", ") : "—"}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created on",
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
  },
  {
    accessorKey: "draft",
    header: "Status",
    cell: ({ row }) => {
      const isDraft = row.original.draft;
      const status = isDraft ? "Draft" : "Published";
      return (
        <Badge
          variant="outline"
          className="text-xs text-(text--sub-600) min-h-6 p-1 pr-2 rounded-[0.375rem]"
        >
          <>
            {!isDraft && (
              <Icon
                name="select-box-circle-fill"
                color="var(--state--success--base)"
                size={13}
              />
            )}
            {isDraft && (
              <Icon
                name="information-fill"
                color="var(--state--information--base)"
                size={16}
              />
            )}
          </>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "organisation",
    header: "Organisation",
    cell: ({ row }) => (
      <span>{row.original.organisation?.name ?? "—"}</span>
    ),
  },
  {
    id: "climate_zone",
    header: "Climate zone",
    cell: ({ row }) => (
      <span>{row.original.climate_zone?.name ?? "—"}</span>
    ),
  },
  {
    id: "total_floor_area",
    header: "Floor area",
    cell: ({ row }) => {
      const area = row.original.total_floor_area;
      return <span>{area ? `${area} m²` : "—"}</span>;
    },
  },
  {
    id: "total_carbon_footprint",
    header: "Carbon footprint",
    cell: ({ row }) => {
      const val = row.original.total_carbon_footprint;
      return <span>{val !== null && val !== undefined ? val.toFixed(2) : "—"}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: () => (
      <ChevronRight className="h-4 w-4 text-(--icon--sub-600)" size={12} />
    ),
  },
];

export const Table = () => {
  const { buildings, isLoading, isFetching } = useBuildingContext();

  if (isLoading && !buildings) {
    return (
      <div className="w-full h-60 grid place-items-center">
        <Loader size={56} />
      </div>
    );
  }

  if (!buildings || buildings.length === 0) {
    return <div className="p-8 text-center">No buildings found.</div>;
  }

  return (
    <div className="overflow-auto hide-scrollbar w-full grid grid-cols-1">
      <DataTable columns={columns} data={buildings} isLoading={isFetching} />
    </div>
  );
};
