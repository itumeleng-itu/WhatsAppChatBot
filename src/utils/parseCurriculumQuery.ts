import { parsePaginationParams, type RawParams, type BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';

export type CurriculumQuery = BasePaginationQuery;

export function parseCurriculumQueryParams(params: RawParams): CurriculumQuery {
  return parsePaginationParams(params);
}