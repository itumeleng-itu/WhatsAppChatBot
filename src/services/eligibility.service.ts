import { EligibilityItem, EligibilityQuery, EligibilityResponse } from '../types/eligibility.types';

const ELIGIBILITY_API = process.env.CODETRIBE_PROGRAMMES_API;

export const fetchEligibility = async (
  programmeId: string,
  query: EligibilityQuery
): Promise<EligibilityResponse> => {
  if (!ELIGIBILITY_API) throw new Error('Eligibility API URL not defined in .env');

  const params = new URLSearchParams({
    limit: String(query.limit ?? 20),
    offset: String(query.offset ?? 0),
    sort: query.sort ?? 'sort_order',
    order: query.order ?? 'asc',
  });

  const url = `${ELIGIBILITY_API}/${programmeId}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch eligibility data');

  const json = await res.json();
  return json;
};