export type CurriculumOrder = 'asc' | 'desc';

//* Query params
export interface CurriculumQuery {
  limit?: number;
  offset?: number;
  sort?: string;     
  order?: CurriculumOrder;
}

//* Curriculum module item
export interface CurriculumItem {
  id: string;
  programme_id: string;
  module_name: string;
  module_description: string;
  topics_covered: string[];
  duration_weeks: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

//* API response
export interface CurriculumResponse {
  data: CurriculumItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  meta?: {
    timestamp: string;
    endpoint: string;
  };
}
