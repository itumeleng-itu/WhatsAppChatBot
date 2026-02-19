import { parsePaginationParams, scalar, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { PolicyCategory } from '../types/policies.types';
import type { BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';

export interface PoliciesQueryParams extends BasePaginationQuery {
  category?: PolicyCategory;
}

export function parsePoliciesQueryParams(params: RawParams): PoliciesQueryParams {
  const result: PoliciesQueryParams = { ...parsePaginationParams(params) };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory as PolicyCategory;

  return result;
}