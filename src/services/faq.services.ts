import { FaqsApiResponse } from "../types/faq.types";
import { parseFaqQueryParams } from "../utils/parseFaqQuery";
import { RawParams } from "../utils/sharedfile-utility/parseQuery.sharedFile";
import { apiFetch, buildUrl } from "./apiService/apiService.shared";

export const fetchFaqs = async (params: RawParams): Promise<FaqsApiResponse> => {
  const query = parseFaqQueryParams(params);

  if (!query) {
    throw new Error('Failed to fetch FAQs: q and scope are required parameters');
  }

  const url = buildUrl('/api/faqs', query);
  return apiFetch<FaqsApiResponse>(url, 'FAQs');
};
