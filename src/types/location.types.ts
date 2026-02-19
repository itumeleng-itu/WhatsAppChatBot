// ─── Enums ────────────────────────────────────────────────────────────────────

export type LocationType =
  | "headquarters"
  | "satellite"
  | "partner_site";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address_line1: string | null;
  address_line2: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  operating_hours: string | null;
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

export interface LocationsApiResponse {
  data: Location[];
  pagination: Pagination;
  meta: ApiMeta;
}