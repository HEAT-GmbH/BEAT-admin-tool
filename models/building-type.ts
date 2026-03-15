export interface BuildingType {
  id: string;
  name: string;
  has_subtypes: boolean;
  subtype_count: number;
  status: "active" | "inactive";
  subtypes: BuildingSubType[];
}

export interface BuildingSubType {
  id: string;
  name: string;
  is_active: boolean;
}