// ─── Enums ────────────────────────────────────────────────────────────────────

export type PolicyCategory =
  | "assessment"
  | "attendance"
  | "conduct"
  | "confidentiality"
  | "equipment"
  | "internet"
  | "termination"
  | "other";

export type PolicyAppliesTo = "all_programmes" | "CodeTribe Academy";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Policy {
  id: string;
  policy_category: PolicyCategory;
  policy_name: string;
  policy_description: string;
  applies_to: PolicyAppliesTo;
  is_mandatory: boolean;
  consequences: string | null;
  source_document: string;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface ApiMeta {
  timestamp: string; // ISO 8601 datetime string
  endpoint: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface PoliciesApiResponse {
  data: Policy[];
  pagination: Pagination;
  meta: ApiMeta;
}