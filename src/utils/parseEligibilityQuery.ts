import { parsePaginationParams, type RawParams, type BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';

export type EligibilityQuery = BasePaginationQuery;

export function parseEligibilityQueryParams(params: RawParams): EligibilityQuery {
  return parsePaginationParams(params);
}