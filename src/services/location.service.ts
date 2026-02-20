import { LocationsApiResponse } from "../types/location.types";
import { parseLocationsQueryParams } from "../utils/parseLocationQuery";
import { RawParams } from "../utils/sharedfile-utility/parseQuery.sharedFile";
import { apiFetch, buildUrl } from "./apiService/apiService.shared";

export const fetchLocations = async (
  params?: RawParams
): Promise<LocationsApiResponse> => {
  const query = params ? parseLocationsQueryParams(params) : {};
  const url = buildUrl('/api/locations', query);
  return apiFetch<LocationsApiResponse>(url, 'locations');
};