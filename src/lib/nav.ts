export interface NavItem {
  label: string;
  href: string;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Core Workflow",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Brand", href: "/brand" },
      { label: "Generate", href: "/generate" },
      { label: "My Products", href: "/products" },
      { label: "Batches", href: "/batches", badge: 3 },
      { label: "Review Queue", href: "/review", badge: 5 },
      { label: "Export", href: "/export" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Category Training", href: "/category-training" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Analytics", href: "/analytics" },
      { label: "API Docs", href: "/api-docs" },
      { label: "Integrations", href: "/integrations" },
      { label: "Billing", href: "/billing" },
      { label: "Team", href: "/team" },
      { label: "Activity", href: "/activity" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

/** Breadcrumb / page title per route, mirrors the prototype's viewMap. */
export const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/brand": "My Brand",
  "/generate": "Generate",
  "/products": "My Products",
  "/batches": "Batches",
  "/review": "Review Queue",
  "/export": "Export Center",
  "/category-training": "Category Training",
  "/categories": "Categories",
  "/analytics": "Analytics",
  "/api-docs": "API",
  "/integrations": "Integrations",
  "/billing": "Billing",
  "/team": "Team",
  "/activity": "Activity Log",
  "/settings": "Settings",
};
