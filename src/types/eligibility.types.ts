export type ElibilityOrder = 'asc' | 'desc';

export interface EligilityQuery{

    limit : number,
    offset : number,
    sort : string,
    order : ElibilityOrder
}