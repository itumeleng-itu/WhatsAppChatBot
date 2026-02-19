import { parsePaginationParams, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { ApplicationStepQuery } from '../types/application.types';

export function parseApplicationStepQueryParams(params: RawParams): ApplicationStepQuery {
  return parsePaginationParams(params);
}