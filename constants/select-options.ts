import { UserRole } from "@/models/user";

export const temperatureOptions = [
  { label: "°Celsius", value: "celsius" },
  { label: "°Fahrenheit", value: "fahrenheit" },
]

export const numberOfStarsOptions = [
  { item: "1 star", value: "1" },
  { item: "2 stars", value: "2" },
  { item: "3 stars", value: "3" },
  { item: "4 stars", value: "4" },
  { item: "5 stars", value: "5" },
]

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] =
  [
    {
      value: "super_admin",
      label: "System Admin",
      description: "Full access to all system settings and organizations",
    },
    {
      value: "org_admin",
      label: "Organization Admin",
      description: "Can manage organization settings and users",
    },
    {
      value: "data_manager",
      label: "Data Manager",
      description: "Can view and edit data for their organization",
    },
    { value: "viewer", label: "Viewer", description: "Read-only access" },
  ];
