import { EligibilityQuery, EligibilityOrder }  from '../types/eligibility.types';

export const parseEligibilityQuery = (
  query: Record<string, string | undefined>
): EligibilityQuery => {
  const limit = query.limit ? Number(query.limit) : 20;
  const offset = query.offset ? Number(query.offset) : 0;

  return {
    limit: limit > 100 ? 100 : limit,
    offset,
    sort: query.sort ?? 'sort_order',  
    order: (query.order as EligibilityOrder) ?? 'asc',
  };
};
