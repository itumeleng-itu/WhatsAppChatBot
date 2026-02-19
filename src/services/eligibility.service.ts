import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseEligibilityQueryParams } from '../utils/parseEligibilityQuery';
import type { EligibilityResponse } from '../types/eligibility.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchEligibility = async (
  programmeId: string,
  params?: RawParams
): Promise<EligibilityResponse> => {
  const query = params ? parseEligibilityQueryParams(params) : {};
  const url = buildUrl(`/api/eligibility/${programmeId}`,query );
  return apiFetch<EligibilityResponse>(url, 'eligibility');
};