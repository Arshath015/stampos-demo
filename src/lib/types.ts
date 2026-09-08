export type ConfidenceTier = "hi" | "md" | "lo";

export function confidenceTier(score: number): ConfidenceTier {
  if (score >= 87) return "hi";
  if (score >= 72) return "md";
  return "lo";
}

export type ReviewStatus = "approved" | "pending" | "rejected" | "ai-enhanced";

export interface ResultImage {
  id: string;
  src: string;
  confidence: number;
  status: ReviewStatus;
  title?: string;
  meta?: string;
}

export interface Shade {
  shade: string;
  src: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brandScore: number;
  shadeCount: number;
  shades: Shade[];
}

export type BatchReviewState =
  | "pending-batch-review"
  | "in-progress"
  | "generating"
  | "complete";

export interface Batch {
  id: string;
  productName: string;
  category: string;
  images: number;
  reviewState: BatchReviewState;
  reviewedCount?: number;
  approved?: number;
  rejected?: number;
  action: "review" | "export" | "generating" | "start-review";
  updated: string;
}

export interface CategoryTrainingRow {
  name: string;
  score: number;
}

export interface CategoryGroupData {
  label: string;
  accent: string;
  subgroups: { title: string; chips: string[] }[];
}
