import { FaqQuery } from '../types/faq.types';

export const parseFaqQuery = (
  query: Record<string, string | undefined>
): FaqQuery => {
  const limit = query.limit ? Number(query.limit) : 20;
  const offset = query.offset ? Number(query.offset) : 0;

  return {
    q: query.q ?? '',
    scope: (query.scope as 'mlab' | 'codetribe') ?? 'mlab',
    category: query.category,
    source: query.source,
    limit: limit > 100 ? 100 : limit,
    offset,
    sort: query.sort,
    order: (query.order as 'asc' | 'desc') ?? 'asc',
  };
};
