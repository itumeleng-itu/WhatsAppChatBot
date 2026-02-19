import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseProgrammeQueryParams } from '../utils/parseProgrammeQuery';
import type { ProgrammeResponse } from '../types/programmes.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchProgrammes = async (
  params?: RawParams
): Promise<ProgrammeResponse> => {
  const query = params ? parseProgrammeQueryParams(params) : {};
  const url = buildUrl('/api/programmes', query);
  return apiFetch<ProgrammeResponse>(url, 'programmes');
};