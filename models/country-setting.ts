export interface CountryCity {
  name: string;
  is_active: boolean;
}

export interface CountrySetting {
  id: string;
  name: string;
  city_count: number;
  status: "active" | "inactive";
  cities?: CountryCity[];
}