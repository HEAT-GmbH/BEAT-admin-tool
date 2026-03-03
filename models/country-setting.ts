export interface CountrySetting {
  id: string;
  name: string;
  citiesCount: number;
  status: "Active" | "Inactive";
  addedOn: string;
  cities: { name: string; isActive: boolean }[];
}
