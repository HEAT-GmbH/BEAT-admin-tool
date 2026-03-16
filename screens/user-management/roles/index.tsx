import React from "react";
import { UserRole } from "@/models/user";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";

type Row = {
  role: UserRole;
  label: string;
  description: string;
  permissions: string[];
  users?: number;
};

const ROLES_DATA: Row[] = [
  {
    role: "super_admin",
    label: "System Admin",
    description:
      "Full access to all system settings, organizations, and user management across the entire platform.",
    permissions: [
      "Manage all users",
      "Manage all organizations",
      "System configuration",
      "Full data access",
    ],
  },
  {
    role: "org_admin",
    label: "Organization Admin",
    description:
      "Can manage organization-level settings, users, and data within their assigned organization.",
    permissions: [
      "Manage org users",
      "Organization settings",
      "View org data",
      "Export reports",
    ],
  },
  {
    role: "data_manager",
    label: "Data Manager",
    description:
      "Can view and edit data entries for their assigned organization and country access.",
    permissions: ["Create & edit data", "View reports", "Upload documents"],
  },
  {
    role: "viewer",
    label: "Viewer",
    description:
      "Read-only access to view data and reports within their assigned scope.",
    permissions: ["View data", "View reports"],
  },
];

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "label",
    header: "ROLE",
    cell: ({ row }) => (
      <span className="font-medium text-base">{row.original.label}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => (
      <span className="text-secondary-foreground text-base text-wrap">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "permissions",
    header: "PERMISSIONS",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 flex-wrap">
        {row.original.permissions.map((permission) => (
          <Badge
            key={permission}
            className="text-xs h-5.5 rad-1.5! bg-muted font-medium py-0.5 px-2"
          >
            {permission}
          </Badge>
        ))}
      </div>
    ),
  },
];

export const Roles = () => {
  const userCount: Record<UserRole, number> = {
    super_admin: 1,
    org_admin: 1,
    data_manager: 1,
    viewer: 1,
  };

  const cols: ColumnDef<Row>[] = [
    ...columns,
    {
      accessorKey: "users",
      header: "USERS",
      cell: ({ row }) => (
        <span className="font-medium text-base text-center mx-auto block">
          {userCount[row.original.role]}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-2 grid overflow-x-auto">
      <DataTable columns={cols} data={ROLES_DATA} />
    </div>
  );
};
