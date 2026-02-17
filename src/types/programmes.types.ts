export type programmeOrder = 'asc' | 'desc';

//* Query params sent to the API 
export interface ProgrammeQuery {
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: programmeOrder;
}

// * One programme item from external API 
export interface ProgrammeItem {
  id: string; 
  name: string;
  category: string;
  short_description: string;
  duration_weeks: number;
  is_active: boolean;
}

//* Pagination info 
export interface ProgrammePagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

//* Full API response 
export interface ProgrammeResponse {
  data: ProgrammeItem[];
  pagination: ProgrammePagination;
}
