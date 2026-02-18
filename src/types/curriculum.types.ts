// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface CurriculumModule {
  id: string;
  programme_id: string;
  module_name: string;
  module_description: string;
  topics_covered: string[];
  duration_weeks: number;
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

export interface CurriculumApiResponse {
  data: CurriculumModule[];
  pagination: Pagination;
  meta: ApiMeta;
}