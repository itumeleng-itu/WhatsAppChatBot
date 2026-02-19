// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface ApplicationStep {
  id: string;
  programme_id: string;
  step_number: number;
  step_name: string;
  step_description: string;
  required_documents: string[] | null; // null = no documents required for this step
  deadline_info: string | null;
  estimated_duration: string;
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

export interface ApplicationProcessApiResponse {
  data: ApplicationStep[];
  pagination: Pagination;
  meta: ApiMeta;
}