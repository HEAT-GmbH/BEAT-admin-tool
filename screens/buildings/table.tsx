"use client";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { selectColumn } from "@/constants/data-table";
import { Building } from "@/models/building";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { useBuildingContext } from "./building.context";

const columns: ColumnDef<Building>[] = [
  selectColumn as ColumnDef<Building>,
  {
    accessorKey: "name",
    header: "Building name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "created_on", header: "Created on" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({
      row: {
        original: { status },
      },
    }) => (
      <Badge
        variant="outline"
        className="text-xs text-(text--sub-600) min-h-6 p-1 pr-2 rounded-[0.375rem]"
      >
        <>
          {status === "Active" && (
            <Icon
              name="select-box-circle-fill"
              color="var(--state--success--base)"
              size={13}
            />
          )}
          {status === "Archived" && (
            <Icon
              name="error-warning-fill"
              color="var(--state--error--base)"
              size={16}
            />
          )}
          {status === "Draft" && (
            <Icon
              name="information-fill"
              color="var(--state--information--base)"
              size={16}
            />
          )}
        </>
        {status}
      </Badge>
    ),
  },
  { accessorKey: "total_emissions", header: "Total Emissions" },
  { accessorKey: "building_type", header: "Building type" },
  {
    accessorKey: "assigned_to",
    header: "Assigned to",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={row.original.assigned_to.avatar}
            alt={row.original.assigned_to.name}
          />
          <AvatarFallback>
            {row.original.assigned_to.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-slate-900">{row.original.assigned_to.name}</span>
      </div>
    ),
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
