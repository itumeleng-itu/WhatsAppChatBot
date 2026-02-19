import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseSchedulesQueryParams } from '../utils/parseScheduleQuery';
import type { SchedulesApiResponse } from '../types/schedules.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchSchedules = async (
  programmeId: string,
  params?: RawParams
): Promise<SchedulesApiResponse> => {
  const query = params ? parseSchedulesQueryParams(params) : {};
  const url = buildUrl(`/api/schedules/${programmeId}`, query);
  return apiFetch<SchedulesApiResponse>(url, 'schedules');
};