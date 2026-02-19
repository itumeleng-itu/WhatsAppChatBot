import { parsePaginationParams, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { EligibilityQuery } from '../types/eligibility.types';

export function parseEligibilityQueryParams(params: RawParams): EligibilityQuery {
  return parsePaginationParams(params);
}