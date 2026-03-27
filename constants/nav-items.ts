import { IconName } from "@/models/icons";

export const sidebarItems: { 
  label: string; 
  href: string; 
  icon: IconName; 
  breadcrumbIcon?: IconName;
  noPadding?: boolean;
  innerSidebar?: {label: string; href: string; icon: IconName}[] 
}[] = [
  {
    label: "Dashboard",
    href: "#",
    icon: "dashboard-horizontal-fill",
  },
  {
    label: "Buildings",
    href: "/buildings",
    icon: "building-3-fill",
    breadcrumbIcon: "building-3-line"
  },
  {
    label: "Emission Config",
    href: "/emission-config",
    icon: "leaf-fill",
    breadcrumbIcon: "building-3-line",
    innerSidebar: [
      { label: "Grid Emission Factors", href: "/emission-config/grid-emission-factors", icon: "outlet-2-line" },
      { label: "Fuel Emission Factors", href: "/emission-config/fuel-emission-factors", icon: "gas-station-line" },
      { label: "Cooling Systems", href: "/emission-config/cooling-systems", icon: "snowflake-line" },
      { label: "Ventilation Systems", href: "/emission-config/ventilation-systems", icon: "windy-fill" },
      { label: "Lighting Systems", href: "/emission-config/lighting-systems", icon: "lightbulb-flash-line" },
      { label: "Lift & Escalator Systems", href: "/emission-config/lift-escalator-systems", icon: "arrow-up-down-fill" },
      { label: "Hot Water Systems", href: "/emission-config/hot-water-systems", icon: "temp-hot-line" },
    ]
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "file-chart-fill",
    noPadding: true
  },
  {
    label: "Data Management",
    href: "/data-management",
    icon: "database-2-fill",
  },
  {
    label: "Organizations",
    href: "/organizations",
    icon: "building-4-fill",
    breadcrumbIcon: "building-3-line"
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: "user-settings-fill",
  },
  {
    label: "Activity Logs",
    href: "/activity-logs",
    icon: "file-paper-2-fill",
    noPadding: true
  },
  {
    label: "System Settings",
    href: "/system-settings",
    icon: "settings-2-fill",
    breadcrumbIcon: "settings-5-line",
    innerSidebar: [
      { label: "Countries and Cities", href: "/system-settings/countries", icon: "global-line" },
      { label: "Climate types", href: "/system-settings/climate", icon: "rainy-line" },
      { label: "Building types", href: "/system-settings/building", icon: "building-line" },
    ]
  },
];