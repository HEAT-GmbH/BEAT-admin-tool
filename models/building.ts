export interface Building {
  id: string;
  uuid: string;
  name: string;
  country: { id: string; name: string } | null;
  city: { id: string; name: string } | null;
  region: { id: string; name: string } | null;
  climate_zone: { id: string; name: string } | null;
  total_floor_area: string;
  category: { category: string | null; subcategory: string | null } | null;
  construction_year: number | null;
  created_at: string;
  created_by: { id: string; name: string } | null;
  organisation: { id: string; name: string } | null;
  total_carbon_footprint: number | null;
  total_embodied_carbon: number | null;
  total_operational_carbon: number | null;
  draft: boolean;
  public: boolean;
}

export interface AddBuildingStepConfig {
  id: number,
  label: string,
  path: string,
  title?: string,
  description?: string,
  tip?: string
  steps?: MiniStepConfig[]
  isComplete?: boolean
}

export interface MiniStepConfig {
  id: number,
  label: string,
  path: string,
  title?: string,
  description: string,
  tip?: string
  isComplete?: boolean
}
