import { parsePaginationParams, scalar, type RawParams, type BasePaginationQuery } from './sharedfile-utility/parseQuery.sharedFile';
import type { FaqCategory, FaqSource } from '../types/faq.types';

const VALID_SCOPES = new Set<string>(['mlab', 'codetribe']);

export interface FaqQuery extends BasePaginationQuery {
  q: string;
  scope: string;
  category?: FaqCategory;
  source?: FaqSource;
}

export function parseFaqQueryParams(params: RawParams): FaqQuery | null {
  const q = scalar(params.q);
  if (!q || q.trim() === '') return null;

  const scope = scalar(params.scope);
  if (!scope || !VALID_SCOPES.has(scope)) return null;

  const result: FaqQuery = {
    ...parsePaginationParams(params),
    q: q.trim(),
    scope,
  };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory as FaqCategory;

  const rawSource = scalar(params.source);
  if (rawSource !== undefined) result.source = rawSource as FaqSource;

  return result;
}