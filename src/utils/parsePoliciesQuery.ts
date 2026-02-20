import { parsePaginationParams, scalar, type RawParams, type BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';
import type { PolicyCategory } from '../types/policies.types';

export interface PoliciesQuery extends BasePaginationQuery {
  category?: PolicyCategory;
}

export function parsePoliciesQueryParams(params: RawParams): PoliciesQuery {
  const result: PoliciesQuery = { ...parsePaginationParams(params) };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory as PolicyCategory;

  return result;
}