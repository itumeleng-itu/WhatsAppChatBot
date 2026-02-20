// tests/unit/services/business-api.test.ts
import { BusinessApiService, FAQData } from '../../../src/services/business-api.service';

describe('BusinessApiService', () => {
  let service: BusinessApiService;
  let mockGet: jest.Mock;

  beforeEach(() => {
    // Set retryDelay = 0 to make tests run instantly
    service = new BusinessApiService(0, 3);

    // Mock the internal "get" method (axios or fetch) used inside service
    mockGet = jest.fn();
    (service as any).get = mockGet;

    jest.clearAllMocks();
  });

  // ── getAllFAQs ─────────────────────────────────────────────
  it('should call /faqs and return formatted data', async () => {
    const fakeResponse = {
      data: {
        data: [
          { id: '1', question: 'What is Node?', answer: 'Runtime', category: 'tech' },
        ],
        pagination: {},
      },
    };

    mockGet.mockResolvedValue(fakeResponse);

    const result = await service.getAllFAQs();

    expect(mockGet).toHaveBeenCalledWith('/faqs', { params: { scope: 'codetribe', limit: undefined, offset: undefined } });
    expect(result).toEqual(fakeResponse.data.data);
  });

  it('should throw error if API fails', async () => {
    mockGet.mockRejectedValue(new Error('API error'));

    await expect(service.getAllFAQs()).rejects.toThrow('API error');
  });

  // ── searchFAQs ────────────────────────────────────────────
  it('should return FAQs on successful search', async () => {
    const fakeFAQs: FAQData[] = [
      { id: '1', question: 'Q?', answer: 'A', category: 'test' },
    ];
    mockGet.mockResolvedValue({ data: { data: fakeFAQs } });

    const result = await service.searchFAQs('Q?');
    expect(result).toEqual(fakeFAQs);
    expect(mockGet).toHaveBeenCalledWith('/faqs', { params: { scope: 'codetribe', query: 'Q?', limit: undefined, offset: undefined } });
  });

  it('should return empty array on network error', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const result = await service.searchFAQs('Test');
    expect(result).toEqual([]);
  });

  // ── getCategories ─────────────────────────────────────────
  it('should return array of category strings', async () => {
    const categories = ['tech', 'finance'];
    mockGet.mockResolvedValue({ data: { data: categories } });

    const result = await service.getCategories();

    expect(result).toEqual(categories);
    expect(mockGet).toHaveBeenCalledWith('/faqs/categories', { params: { scope: 'codetribe' } });
  });

  it('should return empty array on error', async () => {
    mockGet.mockRejectedValue(new Error('API error'));

    const result = await service.getCategories();
    expect(result).toEqual([]);
  });
});
