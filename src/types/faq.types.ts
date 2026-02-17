export type faqScope = 'mlab' | 'codetribe';

export interface faqQuery{
q : string,
scope : faqScope,
category ?: string,
source ?: string,
limit ?: number,
offset ?: number
}