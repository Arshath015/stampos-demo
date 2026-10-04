import { batches, reviewQueue } from "./mock-data";

export interface NavItem {
  label: string;
  href: string;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Real counts off the same data the Batches and Review Queue pages render —
// not a separately-authored number that can drift from what's actually there.
const activeBatchCount = batches.filter((b) => b.reviewState !== "complete").length;
const reviewQueueCount = reviewQueue.pendingBatchReview.length + reviewQueue.inIndividualReview.length;

export const navGroups: NavGroup[] = [
  {
    label: "Core Workflow",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Brand", href: "/brand" },
      { label: "Generate", href: "/generate" },
      { label: "My Products", href: "/products" },
      { label: "Batches", href: "/batches", badge: activeBatchCount },
      { label: "Review Queue", href: "/review", badge: reviewQueueCount },
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
