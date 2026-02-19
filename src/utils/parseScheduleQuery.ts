import { parsePaginationParams, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { SchedulesQueryParams } from '../types/schedules.types';

export function parseSchedulesQueryParams(params: RawParams): SchedulesQueryParams {
  return parsePaginationParams(params);
}