import { parsePaginationParams, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { ApplicationStep } from '../types/applicationProcess.types';

export function parseApplicationStepQueryParams(params: RawParams): ApplicationStep {
  return parsePaginationParams(params);
}