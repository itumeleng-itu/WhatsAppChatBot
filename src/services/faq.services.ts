import { buildUrl, apiFetch } from './apiService/apiService.shared';
import { parseFaqQueryParams } from '../utils/parseFaqQuery';
import type { FaqResponse } from '../types/faq.types';
import type { RawParams } from '../utils/sharedfile-utility/parseQuery.sharedFile';

export const fetchFaq = async (params: RawParams): Promise<FaqResponse> => {
  const query = parseFaqQueryParams(params);

  if (!query) {
    throw new Error('Failed to fetch FAQs: q and scope are required parameters');
  }

  const url = buildUrl('/api/faqs',query );
  return apiFetch<FaqResponse>(url, 'FAQs');
};