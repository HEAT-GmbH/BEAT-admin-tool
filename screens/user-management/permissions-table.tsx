"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Permissions } from "@/models/user";
import { ColumnDef } from "@tanstack/react-table";
import { FieldValues, Path } from "react-hook-form";

const labelMap: Record<keyof Permissions, string> = {
  buildings: "Buildings",
  emissionConfig: "Emission Config",
  users: "Users",
  reports: "Reports",
  dashboard: "Dashboard",
  dataManagement: "Data Management",
  organizations: "Organizations",
  systemSettings: "System Settings",
};

interface Props<T extends FieldValues> {
  data: { key: keyof Permissions; control: Path<T> }[];
  task: "add" | "view" | "edit";
  permissions: Permissions;
  setValue: (path: Path<T>, value: Permissions[keyof Permissions]) => void;
}

export const PermissionsTable = <T extends FieldValues>({
  data,
  task,
  permissions,
  setValue,
}: Props<T>) => {
  const columns: ColumnDef<(typeof data)[number]>[] = [
    {
      accessorKey: "key",
      header: "FEATURE AREA",
      cell: ({ row }) => (
        <span className="text-base font-medium text-foreground">
          {labelMap[row.original.key]}
        </span>
      ),
    },
    {
      id: "view",
      header: "VIEW",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].view}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                view: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
    {
      id: "create",
      header: "CREATE",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].create}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                create: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
    {
      id: "edit",
      header: "EDIT",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].edit}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                edit: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
    {
      id: "delete",
      header: "DELETE",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].delete}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                delete: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
    {
      id: "export",
      header: "EXPORT",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].export}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                export: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
    {
      id: "all",
      header: "ALL",
      cell: ({ row }) => (
        <Checkbox
          className="size-5 mx-auto"
          checked={permissions[row.original.key].all}
          onCheckedChange={(checked) => {
            if (task !== "view") {
              setValue(row.original.control, {
                ...permissions[row.original.key],
                all: checked,
              });
            }
          }}
          readOnly={task === "view"}
        />
      ),
    },
  ];
  return (
    <div className="grid h-max overflow-x-auto hide-scrollbar rounded-xl border border-border">
      <DataTable columns={columns} data={data} thClassName="text-center" />
    </div>
  );
};
