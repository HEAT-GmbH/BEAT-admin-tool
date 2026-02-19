import { IconName } from "@/models/icons";

export const sidebarItems: { label: string; href: string; icon: IconName; breadcrumbIcon?: IconName }[] = [
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
    href: "#",
    icon: "building-4-fill",
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
    href: "#",
    icon: "settings-2-fill",
  },
];