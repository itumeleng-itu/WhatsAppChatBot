export type faqScope = 'mlab' | 'codetribe';

//* Query params for fetching FAQs 
export interface faqQuery {
  q: string;
  scope: faqScope;
  category?: string;
  source?: string;
  limit?: number;   
  offset?: number; 
  sort?: string;   
  order?: 'asc' | 'desc';
}

//* Actual FAQ data returned from API 
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  source?: string;
  programme_id?: string | null;
  keywords?: string[];
  priority?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

//* Response from the API 
export interface FaqResponse {
  data: FaqItem[];
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
