export type UserStatus = "Active" | "Inactive";
export type Permission = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  all: boolean;
};
export type UserRole = "super_admin" | "org_admin" | "data_manager" | "viewer" | (string & {});

export interface Permissions {
  buildings: Permission;
  emissionConfig: Permission;
  users: Permission;
  reports: Permission;
  dashboard: Permission;
  dataManagement: Permission;
  organizations: Permission;
  systemSettings: Permission;
}

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  countryAccess: string;
  lastLogin: string;
  status: UserStatus;
  permissions: Permissions;
}
