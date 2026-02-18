//* Sorting order type
export type ApplicationStepOrder = 'asc' | 'desc';

//* Optional query params for pagination/sorting
export interface ApplicationStepQuery {
  limit?: number;
  offset?: number;
  sort?: string; //? can be 'step_number', 'step_name' to sort
  order?: ApplicationStepOrder;
}

//* Single application process step
export interface ApplicationStepItem {
  id: string;
  programme_id: string;
  step_number: number;
  step_name: string;
  step_description: string;
  required_documents: string[] | null;
  deadline_info?: string | null;
  estimated_duration?: string | null;
  created_at?: string;
  updated_at?: string;
}

//* API response structure
export interface ApplicationStepResponse {
  data: ApplicationStepItem[];
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
