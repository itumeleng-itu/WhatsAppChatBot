import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parsePoliciesQueryParams } from '../utils/parsePoliciesQuery';
import type { Policy } from '../types/policies.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchPolicies = async (
  params?: RawParams
): Promise<Policy> => {
  const query = params ? parsePoliciesQueryParams(params) : {};
  const url = buildUrl('/api/policies', query);
  return apiFetch<Policy>(url, 'policies');
};