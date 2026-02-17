import axios, { AxiosInstance } from 'axios';

export interface FAQData {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface Programme {
  id: string;
  name: string;
  category: string;
  short_description?: string;
  full_description?: string;
  duration_weeks?: number;
  subsidy_amount?: number;
  total_value?: number;
  is_active: boolean;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface Meta {
  timestamp: string;
  endpoint: string;
}

export interface MLabApiResponse<T> {
  data: T[];
  pagination: Pagination;
  meta: Meta;
}

export interface MLabApiSingleResponse<T> {
  data: T;
  meta: Meta;
}

export interface MLabApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Service to interact with the mLab Knowledge API that contains FAQ data
 */
export class BusinessApiService {
  private client: AxiosInstance;
  private apiUrl: string;
  private programId: string;
  private scope: string;

  constructor() {
    this.apiUrl = process.env.BUSINESS_API_URL || 'https://mlab-knowledge-api.vercel.app/api';
    this.programId = process.env.PROGRAM_ID || 'c76a6628-455f-4afa-9fba-6125f6ff7c40';
    this.scope = process.env.API_SCOPE || 'codetribe'; // 'mlab' | 'codetribe'
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Handle API response and extract data
   */
  private handleResponse<T>(response: any): T[] {
    // Check if response has error structure
    if (response.data.error) {
      const error = response.data as MLabApiError;
      throw new Error(`API Error: ${error.message} (${error.statusCode})`);
    }

    // Extract data from mLab API format
    const apiResponse = response.data as MLabApiResponse<T>;
    return apiResponse.data || [];
  }

  /**
   * Fetch all FAQs from the business API
   */
  async getAllFAQs(): Promise<FAQData[]> {
    try {
      const response = await this.client.get<MLabApiResponse<FAQData>>('/faqs', {
        params: {
          scope: this.scope,
        },
      });
      return this.handleResponse<FAQData>(response);
    } catch (error: any) {
      console.error('Error fetching FAQs from business API:', error);
      if (error.response?.data) {
        const apiError = error.response.data as MLabApiError;
        throw new Error(`Failed to fetch FAQ data: ${apiError.message}`);
      }
      throw new Error('Failed to fetch FAQ data');
    }
  }

  /**
   * Fetch FAQs by category
   */
  async getFAQsByCategory(category: string): Promise<FAQData[]> {
    try {
      const response = await this.client.get<MLabApiResponse<FAQData>>(`/faqs`, {
        params: {
          scope: this.scope,
          category: category,
        },
      });
      return this.handleResponse<FAQData>(response);
    } catch (error: any) {
      console.error(`Error fetching FAQs for category ${category}:`, error);
      if (error.response?.data) {
        const apiError = error.response.data as MLabApiError;
        console.error(`API Error: ${apiError.message}`);
      }
      return [];
    }
  }

  /**
   * Search FAQs by query
   */
  async searchFAQs(query: string): Promise<FAQData[]> {
    try {
      const response = await this.client.get<MLabApiResponse<FAQData>>(`/faqs`, {
        params: {
          scope: this.scope,
          q: query,
        },
      });
      return this.handleResponse<FAQData>(response);
    } catch (error: any) {
      console.error(`Error searching FAQs for query "${query}":`, error);
      if (error.response?.data) {
        const apiError = error.response.data as MLabApiError;
        console.error(`API Error: ${apiError.message}`);
      }
      return [];
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.client.get<MLabApiResponse<string>>('/faqs/categories', {
        params: {
          scope: this.scope,
        },
      });
      return this.handleResponse<string>(response);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      if (error.response?.data) {
        const apiError = error.response.data as MLabApiError;
        console.error(`API Error: ${apiError.message}`);
      }
      return [];
    }
  }

  /**
   * Get programme by ID
   */
  async getProgrammeById(programmeId?: string): Promise<Programme | null> {
    try {
      const id = programmeId || this.programId;
      const response = await this.client.get<MLabApiSingleResponse<Programme> | MLabApiError>(`/programmes/${id}`, {
        params: {
          scope: this.scope,
        },
      });
      
      // Check for error structure
      if ('error' in response.data && response.data.error) {
        const error = response.data as MLabApiError;
        throw new Error(`API Error: ${error.message} (${error.statusCode})`);
      }

      const apiResponse = response.data as MLabApiSingleResponse<Programme>;
      return apiResponse.data || null;
    } catch (error: any) {
      console.error(`Error fetching programme ${programmeId || this.programId}:`, error);
      if (error.response?.data) {
        const apiError = error.response.data as MLabApiError;
        console.error(`API Error: ${apiError.message}`);
      }
      return null;
    }
  }

  /**
   * Get current programme details
   */
  async getCurrentProgramme(): Promise<Programme | null> {
    return this.getProgrammeById(this.programId);
  }
}
