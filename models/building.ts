export interface Building {
  id: string;
  name: string;
  location: string;
  created_on: string;
  total_emissions: string;
  building_type: string;
  assigned_to: {
    name: string;
    avatar?: string;
  };
  status: 'Active' | 'Draft' | 'Archived';   
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
