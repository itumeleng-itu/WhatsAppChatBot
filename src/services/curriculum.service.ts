import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseCurriculumQueryParams } from '../utils/parseCurriculumQuery';
import type { CurriculumApiResponse } from '../types/curriculum.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchCurriculum = async (
  programmeId: string,
  params?: RawParams
): Promise<CurriculumApiResponse> => {
  const query = params ? parseCurriculumQueryParams(params) : {};
  const url = buildUrl(`/api/curriculum/${programmeId}`, query);
  return apiFetch<CurriculumApiResponse>(url, 'curriculum');
};