import { parsePaginationParams, scalar, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { PoliciesApiResponse, PolicyCategory } from '../types/policies.types';

export function parsePoliciesQueryParams(params: RawParams): PoliciesApiResponse {
  const result: PoliciesApiResponse = { ...parsePaginationParams(params) };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory as PolicyCategory;

  return result;
}