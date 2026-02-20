import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseApplicationStepQueryParams } from '../utils/parseApplicationQuery';
import type { ApplicationProcessApiResponse } from '../types/applicationProcess.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchApplicationSteps = async (
  programmeId: string,
  params?: RawParams
): Promise<ApplicationProcessApiResponse> => {
  const query = params ? parseApplicationStepQueryParams(params) : {};
  const url = buildUrl(`/api/application-process/${programmeId}`, query);
  return apiFetch<ApplicationProcessApiResponse>(url, 'application steps');
};