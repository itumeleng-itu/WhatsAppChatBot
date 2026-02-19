import { parsePaginationParams, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { CurriculumQuery } from '../types/curriculum.types';

export function parseCurriculumQueryParams(params: RawParams): CurriculumQuery {
  return parsePaginationParams(params);
}