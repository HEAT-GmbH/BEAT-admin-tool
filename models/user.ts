export type UserStatus = "Active" | "Inactive";
export type Permission = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  all: boolean;
};
export type UserRole = "superadmin" | "admin" | "org_admin" | "data_manager" | "viewer" | (string & {});

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

export interface UserListItem {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  organisations: { id: string; name: string; role: string }[];
  countries: { id: number; name: string }[];
  app_access: string[];
  last_login: string | null;
  is_active: boolean;
  date_joined: string;
  profile: {
    country: { id: number; name: string } | null;
    region: { id: number; name: string } | null;
    city: { id: number; name: string } | null;
    consent_flag: boolean;
  };
}

// kept for compatibility with screens that haven't been migrated yet
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
