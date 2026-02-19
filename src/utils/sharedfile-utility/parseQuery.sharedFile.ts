//!  Shared query-param parsing utilities
//!  Used by all resource-specific parsers below

export type RawParams = Record<string, string | string[] | undefined>;
export type Order = 'asc' | 'desc';

export interface BasePaginationQuery {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: Order;
}

const VALID_ORDERS = new Set<string>(['asc', 'desc']);

//** Safely coerce a query param to a single string (takes first item if array).
export function scalar(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

//** Parse the four pagination/sorting params shared by every query interface. 
export function parsePaginationParams(params: RawParams): BasePaginationQuery {
  const result: BasePaginationQuery = {};

  const rawLimit = scalar(params.limit);
  if (rawLimit !== undefined) {
    const limit = parseInt(rawLimit, 10);
    if (!isNaN(limit) && limit > 0) result.limit = limit;
  }

  const rawOffset = scalar(params.offset);
  if (rawOffset !== undefined) {
    const offset = parseInt(rawOffset, 10);
    if (!isNaN(offset) && offset >= 0) result.offset = offset;
  }

  const rawSort = scalar(params.sort);
  if (rawSort !== undefined) result.sort = rawSort;

  const rawOrder = scalar(params.order);
  if (rawOrder !== undefined && VALID_ORDERS.has(rawOrder)) {
    result.order = rawOrder as Order;
  }

  return result;
}