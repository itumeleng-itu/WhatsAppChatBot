// ─── Enums ────────────────────────────────────────────────────────────────────

export type FaqCategory =
  | "policies"
  | "financial"
  | "general"
  | "programme_details"
  | "application"
  | "eligibility"
  | "logistics";

export type FaqSource =
  | "codetribe_whatsapp"
  | "mlab_website"
  | "both";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  source: FaqSource;
  programme_id: string | null; // null = applies globally, not programme-specific
  keywords: string[];
  priority: number;
  is_active: boolean;
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

export interface FaqsApiResponse {
  data: Faq[];
  pagination: Pagination;
  meta: ApiMeta;
}