export type EligibilityOrder = 'asc' | 'desc';

//* Query params (optional for pagination and sorting)
export interface EligibilityQuery {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: EligibilityOrder;
}

//* Actual eligibility item
export interface EligibilityItem {
  id: string;
  programme_id: string;
  criterion_type: string;
  requirement_text: string;
  is_mandatory: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

//* API response 
export interface EligibilityResponse {
  data: EligibilityItem[];
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
