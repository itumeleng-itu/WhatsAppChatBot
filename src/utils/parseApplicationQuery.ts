import { parsePaginationParams, type RawParams, type BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';

export function parseApplicationStepQueryParams(params: RawParams): BasePaginationQuery {
  return parsePaginationParams(params);
}