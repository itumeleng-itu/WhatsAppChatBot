import { parsePaginationParams, scalar, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { ProgrammeQuery } from '../types/programmes.types';

export function parseProgrammeQueryParams(params: RawParams): ProgrammeQuery {
  const result: ProgrammeQuery = { ...parsePaginationParams(params) };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory;

  return result;
}