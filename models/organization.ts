export interface OrgAdmin {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  country: { id: number; name: string } | null;
  city: { id: number; name: string } | null;
  created_at: string;
  status: "active" | "inactive";
  admins: OrgAdmin[];
  buildings_count: number;
  total_emissions: string | null;
}
