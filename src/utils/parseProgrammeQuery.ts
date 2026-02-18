import { ProgrammeQuery, programmeOrder } from '../types/schedules.types';

export const parseProgrammeQuery = (
  query: Record<string, string | undefined>
): ProgrammeQuery => {
  const limit = query.limit ? Number(query.limit) : 20;
  const offset = query.offset ? Number(query.offset) : 0;

  return {
    category: query.category,
    limit: limit > 100 ? 100 : limit,
    offset: offset >= 0 ? offset : 0,
    sort: query.sort ?? 'name',
    order: (query.order as programmeOrder) ?? 'asc',
  };
};
