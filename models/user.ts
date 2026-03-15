export interface UserOrganisation {
  id: string;
  name: string;
  role: string;
}

export interface UserListItem {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "superadmin" | "admin" | "viewer";
  organisations: UserOrganisation[];
  countries: { id: number; name: string }[];
  app_access: boolean;
  last_login: string | null;
  is_active: boolean;
  date_joined: string;
  profile: {
    avatar?: string | null;
  } | null;
}
