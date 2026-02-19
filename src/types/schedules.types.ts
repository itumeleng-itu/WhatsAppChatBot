// ─── Enums ────────────────────────────────────────────────────────────────────

export type EventType =
  | "bootcamp"
  | "class_hours"
  | "graduation";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Schedule {
  id: string;
  programme_id: string;
  event_type: EventType;
  description: string;
  start_date: string; // ISO 8601 date string (YYYY-MM-DD)
  end_date: string;   // ISO 8601 date string (YYYY-MM-DD)
  days_of_week: DayOfWeek[];
  start_time: string; // Time string (HH:MM:SS)
  end_time: string;   // Time string (HH:MM:SS)
  is_recurring: boolean;
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

export interface SchedulesApiResponse {
  data: Schedule[];
  pagination: Pagination;
  meta: ApiMeta;
}