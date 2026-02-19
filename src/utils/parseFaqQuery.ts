import { parsePaginationParams, scalar, type RawParams } from './sharedfile-utility/parseQuery.sharedFile';
import type { faqQuery, faqScope } from '../types/faq.types';

const VALID_FAQ_SCOPES = new Set<string>(['mlab', 'codetribe']);

export function parseFaqQueryParams(params: RawParams): faqQuery | null {
  //? q and scope are required — return null if either is missing/invalid
  const q = scalar(params.q);
  if (!q || q.trim() === '') return null;

  const rawScope = scalar(params.scope);
  if (!rawScope || !VALID_FAQ_SCOPES.has(rawScope)) return null;

  const result: faqQuery = {
    ...parsePaginationParams(params),
    q: q.trim(),
    scope: rawScope as faqScope,
  };

  const rawCategory = scalar(params.category);
  if (rawCategory !== undefined) result.category = rawCategory;

  const rawSource = scalar(params.source);
  if (rawSource !== undefined) result.source = rawSource;

  return result;
}