import { ProgrammeQuery, programmeOrder, programmeScope } from '../types/programmes.types'

export const parseProgrammeQuery = (
  query: Record<string, string | undefined>
): ProgrammeQuery => {
  const limit = query.limit ? Number(query.limit) : 20;

  return {
    scope: query.scope as programmeScope | undefined,
    category: query.category,
    limit: limit > 100 ? 100 : limit,
    offset: query.offset ? Number(query.offset) : 0,
    sort: query.sort ?? 'name',
    order: (query.order as programmeOrder) ?? 'asc',
  };
};
