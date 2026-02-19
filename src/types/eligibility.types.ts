// ─── Enums ────────────────────────────────────────────────────────────────────

export type CriterionType =
  | "age"
  | "citizenship"
  | "qualification"
  | "employment_status"
  | "financial"
  | "other";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface EligibilityCriterion {
  id: string;
  programme_id: string;
  criterion_type: CriterionType;
  requirement_text: string;
  is_mandatory: boolean;
  sort_order: number;
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

export interface EligibilityApiResponse {
  data: EligibilityCriterion[];
  pagination: Pagination;
  meta: ApiMeta;
}