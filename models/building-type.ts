export interface BuildingType {
  id: string;
  name: string;
  has_subtypes: boolean;
  subtype_count: number;
  subtypes: BuildingSubType[];
  status: string;
}

export interface BuildingSubType {
  id: string;
  name: string;
}
