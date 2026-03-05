"use client";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Organization } from "@/models/organization";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Eye, Building2, Pencil, Ban } from "lucide-react";
import { useOrgContext } from "./context";

const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Organization name",
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={org.logo} alt={org.name} />
            <AvatarFallback className="bg-(--bg--soft-200) text-(--text--sub-600)">
              {org.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-(--text--strong-950)">
              {org.name}
            </span>
            <span className="text-xs text-(--text--sub-600)">
              Joined on {org.joinDate}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">
        {row.original.industry}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className="text-xs text-(text--sub-600) min-h-6 p-1 pr-2 rounded-[0.375rem] border-(--stroke--soft-200)"
        >
          {status === "Active" ? (
            <Icon
              name="select-box-circle-fill"
              color="var(--state--success--base)"
              size={13}
            />
          ) : (
            <Icon
              name="more-2-line"
              color="var(--icon--disabled-300)"
              size={13}
            />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "buildingsCount",
    header: "Buildings",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">
        {row.original.buildingsCount}
      </span>
    ),
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ row }) => {
      const admin = row.original.admin;
      return (
        <div className="flex items-center gap-2">
          {admin.name !== "N/A" && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={admin.avatar} alt={admin.name} />
              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-sm text-(--text--main-900)">{admin.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalEmissions",
    header: "Total Emissions",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">
        {row.original.totalEmissions}
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4 text-(--icon--sub-600)" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[11.25rem]">
          <DropdownMenuItem className="gap-2">
            <Eye className="h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Building2 className="h-4 w-4" />
            View buildings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit organization
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-red-600">
            <Ban className="h-4 w-4" />
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const Table = () => {
  const { organizations, isLoading, isFetching } = useOrgContext();

  if (isLoading && !organizations) {
    return (
      <div className="w-full h-60 grid place-items-center">
        <Loader size={56} />
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return <div className="p-8 text-center">No organizations found.</div>;
  }

  return (
    <div className="overflow-auto hide-scrollbar w-full grid grid-cols-1">
      <DataTable
        columns={columns}
        data={organizations}
        isLoading={isFetching}
      />
    </div>
  );
};
