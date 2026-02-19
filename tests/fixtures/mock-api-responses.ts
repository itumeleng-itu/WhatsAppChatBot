import { MLabApiResponse, MLabApiError } from '../../src/services/business-api.service';
import { mockFAQs } from './mock-faqs';

export const mockApiResponse: MLabApiResponse<any> = {
  data: mockFAQs,
  pagination: {
    total: 3,
    limit: 10,
    offset: 0,
    hasMore: false,
  },
  meta: {
    timestamp: new Date().toISOString(),
    endpoint: '/faqs',
  },
};

export const mockApiError: MLabApiError = {
  error: 'BadRequest',
  message: 'Invalid request parameters',
  statusCode: 400,
};