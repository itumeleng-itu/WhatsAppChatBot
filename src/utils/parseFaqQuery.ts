import { faqQuery, faqScope } from '../types/faq.types'

export const parseFaqQuery = (
  query: Record<string, string | undefined>
): faqQuery => {
  const limit = query.limit ? Number(query.limit) : 20;
  const offset = query.offset ? Number(query.offset) : 0;

  return {
    q: query.q ?? '', 
    scope: query.scope as faqScope, 
    category: query.category,     
    source: query.source,         
    limit: limit > 100 ? 100 : limit,
    offset: offset >= 0 ? offset : 0, 
  };
};
