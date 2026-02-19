import axios from 'axios';
import { BusinessApiService } from '../../../src/services/business-api.service';

jest.mock('axios');

describe('BusinessApiService', () => {
  let service: BusinessApiService;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();

    // 🔥 Mock axios.create to return fake client
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    service = new BusinessApiService();
    jest.clearAllMocks();
  });

  // =====================================================
  // ✅ getAllFAQs
  // =====================================================
  describe('getAllFAQs', () => {
    it('should call /faqs with scope param and return formatted data', async () => {
      const fakeResponse = {
        data: {
          data: [
            {
              id: '1',
              category: 'tech',
              question: 'What is Node?',
              answer: 'Runtime',
            },
          ],
          pagination: {},
          meta: {},
        },
      };

      mockGet.mockResolvedValue(fakeResponse);

      const result = await service.getAllFAQs();

      expect(mockGet).toHaveBeenCalledWith('/faqs', {
        params: { scope: 'codetribe' },
      });

      expect(result).toEqual(fakeResponse.data.data);
    });

    it('should throw error if API fails', async () => {
      mockGet.mockRejectedValue(new Error('API error'));

      await expect(service.getAllFAQs()).rejects.toThrow(
        'Failed to fetch FAQ data'
      );
    });
  });

  // =====================================================
  // ✅ searchFAQs
  // =====================================================
  describe('searchFAQs', () => {
    it('should pass query as "q" param and return results', async () => {
      const fakeResponse = {
        data: {
          data: [
            {
              id: '2',
              category: 'tech',
              question: 'What is JS?',
              answer: 'Language',
            },
          ],
          pagination: {},
          meta: {},
        },
      };

      mockGet.mockResolvedValue(fakeResponse);

      const result = await service.searchFAQs('JavaScript');

      expect(mockGet).toHaveBeenCalledWith('/faqs', {
        params: {
          scope: 'codetribe',
          q: 'JavaScript',
        },
      });

      expect(result).toEqual(fakeResponse.data.data);
    });

    it('should return empty array on network error (not throw)', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const result = await service.searchFAQs('Test');

      expect(result).toEqual([]);
    });
  });

  // =====================================================
  // ✅ getCategories
  // =====================================================
  describe('getCategories', () => {
    it('should return array of category strings', async () => {
      const fakeResponse = {
        data: {
          data: ['tech', 'finance', 'health'],
          pagination: {},
          meta: {},
        },
      };

      mockGet.mockResolvedValue(fakeResponse);

      const result = await service.getCategories();

      expect(mockGet).toHaveBeenCalledWith('/faqs/categories', {
        params: { scope: 'codetribe' },
      });

      expect(result).toEqual(['tech', 'finance', 'health']);
    });

    it('should return empty array on error', async () => {
      mockGet.mockRejectedValue(new Error('API error'));

      const result = await service.getCategories();

      expect(result).toEqual([]);
    });
  });
});
