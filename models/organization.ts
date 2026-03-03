export interface Organization {
  id: string;
  name: string;
  logo?: string;
  joinDate: string;
  industry: string;
  location: string;
  status: "Active" | "In Active";
  buildingsCount: number;
  admin: {
    name: string;
    avatar?: string;
  };
  totalEmissions?: string;
}
