import { IconName } from "@/models/icons";

export const sidebarItems: { label: string; href: string; icon: IconName; breadcrumbIcon?: IconName; innerSidebar?: {label: string; href: string; icon: IconName}[] }[] = [
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
    href: "#",
    icon: "leaf-fill",
  },
  {
    label: "Reports",
    href: "#",
    icon: "file-chart-fill",
  },
  {
    label: "Data Management",
    href: "#",
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
    href: "#",
    icon: "user-settings-fill",
  },
  {
    label: "Activity Logs",
    href: "#",
    icon: "file-paper-2-fill",
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