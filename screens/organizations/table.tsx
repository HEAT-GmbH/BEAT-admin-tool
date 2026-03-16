"use client";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { MoreVertical, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { useOrgContext } from "./context";
import { ViewOrgDialog } from "./view-org-dialog";

const buildColumns = (
  onView: (org: Organization) => void,
  onEdit: (org: Organization) => void,
): ColumnDef<Organization>[] => [
  {
    accessorKey: "name",
    header: "Organization name",
    cell: ({ row }) => {
      const org = row.original;
      const joinDate = org.created_at ? new Date(org.created_at).toLocaleDateString() : "—";
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback className="bg-(--bg--soft-200) text-(--text--sub-600)">
              {org.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-(--text--strong-950)">{org.name}</span>
            <span className="text-xs text-(--text--sub-600)">Joined on {joinDate}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">{row.original.industry || "—"}</span>
    ),
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const { country, city } = row.original;
      const parts = [city?.name, country?.name].filter(Boolean).join(", ");
      return <span className="text-sm text-(--text--main-900)">{parts || "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant="outline" className="text-xs min-h-6 p-1 pr-2 rounded-[0.375rem] border-(--stroke--soft-200)">
          {status === "active" ? (
            <Icon name="select-box-circle-fill" color="var(--state--success--base)" size={13} />
          ) : (
            <Icon name="forbid-fill" color="var(--icon--disabled-300)" size={13} />
          )}
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "buildings_count",
    header: "Buildings",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">{row.original.buildings_count ?? 0}</span>
    ),
  },
  {
    id: "admin",
    header: "Admin",
    cell: ({ row }) => {
      const admin = row.original.admins?.[0];
      if (!admin) return <span className="text-sm text-(--text--sub-600)">N/A</span>;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{(admin.full_name || admin.email).charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-(--text--main-900)">{admin.full_name || admin.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_emissions",
    header: "Total Emissions",
    cell: ({ row }) => (
      <span className="text-sm text-(--text--main-900)">{row.original.total_emissions ?? "—"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" type="button">
            <MoreVertical className="h-4 w-4 text-(--icon--sub-600)" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[11.25rem]">
          <DropdownMenuItem className="gap-2" onClick={() => onView(row.original)}>
            <Eye className="h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
            Edit organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const Table = () => {
  const { organizations, isLoading, isFetching } = useOrgContext();
  const [viewOrg, setViewOrg] = useState<Organization | null>(null);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);

  const columns = buildColumns(setViewOrg, setEditOrg);

  if (isLoading && !organizations) {
    return <div className="w-full h-60 grid place-items-center"><Loader size={56} /></div>;
  }

  if (!organizations || organizations.length === 0) {
    return <div className="p-8 text-center">No organizations found.</div>;
  }

  return (
    <>
      <div className="overflow-auto hide-scrollbar w-full grid grid-cols-1">
        <DataTable columns={columns} data={organizations} isLoading={isFetching} />
      </div>
      <ViewOrgDialog
        open={!!viewOrg}
        onOpenChange={(open) => !open && setViewOrg(null)}
        orgId={viewOrg?.id ?? null}
        mode="view"
      />
      <ViewOrgDialog
        open={!!editOrg}
        onOpenChange={(open) => !open && setEditOrg(null)}
        orgId={editOrg?.id ?? null}
        mode="edit"
      />
    </>
  );
};
