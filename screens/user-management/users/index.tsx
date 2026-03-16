"use client";

import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { Pagination } from "@/components/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useDebounce from "@/hooks/use-debounce";
import { OrganizationUser } from "@/models/user";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ManageUserDialog } from "./dialog";
import { MoreHorizontal } from "lucide-react";
import { ROLE_OPTIONS } from "@/constants/select-options";
import { CircleFlag } from "react-circle-flags";
import { countriesService } from "@/services/countries.service";

export const Users = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["users", debouncedSearch, currentPage, pageSize],
    queryFn: () =>
      apiService.getUsers({
        search: debouncedSearch,
        currentPage,
        pageSize,
      }),
  });

  const [selectedUser, setSelectedUser] = useState<{
    user: OrganizationUser;
    task: "view" | "edit";
  } | null>(null);

  const totalItems = data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<OrganizationUser>[] = [
    {
      accessorKey: "user",
      header: "USER",
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm leading-tight">
                {user.name}
              </span>
              <span className="text-secondary-foreground text-xs">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "ROLE",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-muted border-border h-7">
          {ROLE_OPTIONS.find((option) => option.value === row.original.role)
            ?.label ?? row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "organization",
      header: "ORGANIZATION",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-(--text--sub-600) text-sm font-medium">
          {row.original.organization && row.original.organization !== "-" && (
            <Icon
              name="building-line"
              color="var(--icon--soft-400)"
              size={16}
            />
          )}
          {row.original.organization || "-"}
        </div>
      ),
    },
    {
      accessorKey: "countryAccess",
      header: "COUNTRY ACCESS",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-(--text--sub-600) text-sm font-medium">
          {row.original.countryAccess === "All Countries" ? (
            <Icon name="global-line" color="var(--icon--soft-400)" size={16} />
          ) : (
            <CircleFlag
              countryCode={row.original.countryAccess}
              className="size-4"
            />
          )}
          {row.original.countryAccess === "All Countries"
            ? row.original.countryAccess
            : countriesService.getName(row.original.countryAccess)}
        </div>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "LAST LOGIN",
      cell: ({ row }) => (
        <div className="text-secondary-foreground text-sm max-w-[120px] leading-tight font-medium text-wrap">
          {row.original.lastLogin}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className="bg-white rounded-sm border-border text-secondary-foreground text-xs font-medium py-1 px-2 h-7"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status === "Active"
                  ? "bg-(--state--success--base)"
                  : "bg-(--state--faded--base)"
              }`}
            />
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="size-8 focus:bg-muted hover:bg-muted rounded-sm grid place-items-center">
            <MoreHorizontal className="text-(--icon--soft-400) size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-sm overflow-hidden p-1 shadow-lg"
          >
            <DropdownMenuItem
              className="gap-2 focus:bg-muted"
              onClick={() =>
                setSelectedUser({ user: row.original, task: "view" })
              }
            >
              <Icon
                name="eye-line"
                size={16}
                className="text-(--icon--soft-400)"
              />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 focus:bg-muted"
              onClick={() =>
                setSelectedUser({ user: row.original, task: "edit" })
              }
            >
              <Icon
                name="edit-line"
                size={16}
                className="text-(--icon--soft-400)"
              />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive focus:bg-(--state--error--lighter) focus:text-destructive">
              <Icon
                name="forbid-fill"
                size={16}
                color="var(--state--error--base)"
              />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 py-4">
        <InputGroup className="h-12 rounded-xl border-(--stroke--soft-200) shadow-sm">
          <InputGroupAddon>
            <Icon
              name="search-2-line"
              color="var(--icon--soft-400)"
              size={20}
            />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="text-base placeholder:text-(--text--soft-400) border-none shadow-none ring-0 focus-visible:ring-0"
          />
        </InputGroup>

        <div className="grid overflow-y-auto">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onNextPage={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="justify-center mt-6"
        />
      </div>
      <ManageUserDialog
        task={selectedUser?.task ?? "view"}
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(null)}
        user={selectedUser?.user ?? null}
      />
    </>
  );
};
