export type programmeScope = 'mlab' | 'codetribe';
export type programmeOrder = 'asc' | 'desc';

/** Query params */
export interface ProgrammeQuery {
  scope?: programmeScope;
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: programmeOrder;
}

/** Actual programme data */
export interface Programme {
  uuid: string;
  name: string;
  scope: programmeScope;
  category: string;
}
