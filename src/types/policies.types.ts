export type PolicyCategory ='assessment' | 'attendance' | 'conduct' | 'confidentiality' | 'equipment' | 'internet' | 'termination' | 'other'| string;

export type PolicyAppliesTo = 'CodeTribe Academy' | 'all_programmes' | string;

export interface Policy {
  id: string;
  policy_category: PolicyCategory;
  policy_name: string;
  policy_description: string;
  applies_to?: PolicyAppliesTo;
  is_mandatory?: boolean;
  consequences: string | null;
  source_document?: string;
  created_at?: string; 
  updated_at?: string; 
}

export interface PoliciesPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PoliciesMeta {
  timestamp: string; 
  endpoint: string;
}

export interface PoliciesResponse {
  data: Policy[];
  pagination: PoliciesPagination;
  meta?: PoliciesMeta;
}

//* Query params for GET /api/policies
export interface PoliciesQueryParams {
  category?: PolicyCategory;
  limit?: number;   
  offset?: number;
  sort?: string;  
  order?: 'asc' | 'desc';
}