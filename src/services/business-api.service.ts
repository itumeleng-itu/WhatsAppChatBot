import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import http from 'http';
import https from 'https';

export interface FAQData {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
  keywords?: string[];
  priority?: number;
  source?: string;
  programme_id?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
  limit: number;
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

export interface EligibilityCriterion {
  id: string;
  programme_id: string;
  criterion_type: string;
  requirement_text: string;
  is_mandatory: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationStep {
  id: string;
  programme_id: string;
  step_number: number;
  step_name: string;
  step_description: string;
  required_documents?: string[] | null;
  deadline_info?: string | null;
  estimated_duration: string;
  created_at?: string;
  updated_at?: string;
}

export interface CurriculumModule {
  id: string;
  programme_id: string;
  module_name: string;
  module_description: string;
  topics_covered: string[];
  duration_weeks: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id: string;
  programme_id: string;
  event_type: string;
  description: string;
  start_date: string;
  end_date: string;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Policy {
  id: string;
  policy_category: string;
  policy_name: string;
  policy_description: string;
  applies_to: string;
  is_mandatory: boolean;
  consequences?: string | null;
  source_document?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  address_line1?: string | null;
  address_line2?: string | null;
  city: string;
  province: string;
  postal_code?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  operating_hours?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  description: string;
  logo_url?: string | null;
  website_url?: string | null;
  partnership_start_date: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Overview {
  id: string;
  name: string;
  short_name: string;
  description: string;
  registration_number: string;
  npo_number: string;
  status: string;
  founded_date: string;
  ceo_name: string;
  mission_statement: string;
  website_url: string;
  contact_email: string;
  contact_phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialBreakdownItem {
  id: string;
  programme_id: string;
  item_name: string;
  item_description: string;
  amount: number;
  currency: string;
  is_cash_subsidy: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Service to interact with the mLab Knowledge API that contains FAQ data
 */
export class BusinessApiService {
  private client: AxiosInstance;
  private apiUrl: string;
  private programId: string;
  private scope: string;
  private maxRetries: number;
  private retryDelay: number; // Initial delay in milliseconds
  private timeout: number;

  // Caching
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheEnabled: boolean;
  private cacheTTL: number; // Time to live in milliseconds

  // Rate limiting awareness
  private rateLimitInfo: RateLimitInfo | null = null;
  private rateLimitEnabled: boolean;

  // Logging
  private loggingEnabled: boolean;

  constructor() {
    this.apiUrl = process.env.BUSINESS_API_URL || 'https://mlab-knowledge-api.vercel.app/api';
    this.programId = process.env.PROGRAM_ID || 'c76a6628-455f-4afa-9fba-6125f6ff7c40';
    this.scope = process.env.API_SCOPE || 'codetribe'; // 'mlab' | 'codetribe'
    this.maxRetries = parseInt(process.env.API_MAX_RETRIES || '3', 10);
    this.retryDelay = parseInt(process.env.API_RETRY_DELAY_MS || '1000', 10);
    this.timeout = parseInt(process.env.API_TIMEOUT_MS || '10000', 10);

    // Caching configuration
    this.cacheEnabled = process.env.API_CACHE_ENABLED !== 'false';
    this.cacheTTL = parseInt(process.env.API_CACHE_TTL_MS || '600000', 10); // Default 10 minutes (increased for better performance)

    // Rate limiting configuration
    this.rateLimitEnabled = process.env.API_RATE_LIMIT_AWARE !== 'false';

    // Logging configuration
    this.loggingEnabled = process.env.API_LOGGING_ENABLED !== 'false';

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      // Connection pooling optimizations for faster requests
      httpAgent: new http.Agent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 50,
        maxFreeSockets: 10,
      }),
      httpsAgent: new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 50,
        maxFreeSockets: 10,
      }),
    });

    // Add response interceptor for rate limiting and logging
    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for logging and rate limit tracking
   */
  private setupInterceptors(): void {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        if (this.loggingEnabled) {
          const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          (config as any).requestId = requestId;
          console.log(`[API Request] ${requestId} ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            timestamp: new Date().toISOString(),
          });
        }
        return config;
      },
      (error) => {
        if (this.loggingEnabled) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor for rate limiting and logging
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.loggingEnabled) {
          const requestId = (response.config as any).requestId || 'unknown';
          console.log(`[API Response] ${requestId} ${response.status} ${response.config.url}`, {
            status: response.status,
            dataLength: JSON.stringify(response.data).length,
            timestamp: new Date().toISOString(),
          });
        }

        // Track rate limit headers if present
        if (this.rateLimitEnabled && response.headers) {
          const remaining = response.headers['x-ratelimit-remaining'];
          const reset = response.headers['x-ratelimit-reset'];
          const limit = response.headers['x-ratelimit-limit'];

          if (remaining !== undefined) {
            this.rateLimitInfo = {
              remaining: parseInt(remaining, 10),
              resetAt: reset ? parseInt(reset, 10) : Date.now() + 60000, // Default 1 minute
              limit: limit ? parseInt(limit, 10) : 100, // Default limit
            };

            if (this.rateLimitInfo.remaining < 10) {
              console.warn(`[Rate Limit Warning] Only ${this.rateLimitInfo.remaining} requests remaining`);
            }
          }
        }

        return response;
      },
      (error) => {
        if (this.loggingEnabled) {
          const requestId = (error.config as any)?.requestId || 'unknown';
          console.error(`[API Response Error] ${requestId}`, {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url,
            timestamp: new Date().toISOString(),
          });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Sleep/delay helper for retry logic
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if an error should be retried
   * Retry on network errors, timeouts, and 5xx server errors
   * Don't retry on 4xx client errors (bad request, unauthorized, etc.)
   */
  private shouldRetry(error: any): boolean {
    // Network errors or timeouts
    if (!error.response) {
      return true;
    }

    // Retry on 5xx server errors
    const status = error.response.status;
    if (status >= 500 && status < 600) {
      return true;
    }

    // Don't retry on 4xx client errors
    return false;
  }

  /**
   * Execute API call with retry logic and exponential backoff
   */
  private async executeWithRetry<T>(
    apiCall: () => Promise<any>,
    operation: string
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await apiCall();
        return response;
      } catch (error: any) {
        lastError = error;

        // Don't retry if it's a client error (4xx) or if we've exhausted retries
        if (!this.shouldRetry(error) || attempt === this.maxRetries) {
          throw error;
        }

        // Calculate exponential backoff delay: delay * 2^attempt
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.warn(
          `API call failed (${operation}), attempt ${attempt + 1}/${this.maxRetries + 1}. ` +
          `Retrying in ${delay}ms...`
        );

        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError;
  }

  /**
   * Validate API response structure
   */
  private validateResponse<T>(response: any): MLabApiResponse<T> {
    // Check if response has error structure
    if (response.data?.error) {
      const error = response.data as MLabApiError;
      throw new Error(`API Error: ${error.message} (Status: ${error.statusCode})`);
    }

    // Validate response structure
    if (!response.data) {
      throw new Error('Invalid API response: missing data field');
    }

    const apiResponse = response.data as MLabApiResponse<T>;

    // Validate required fields
    if (!Array.isArray(apiResponse.data)) {
      throw new Error('Invalid API response: data field is not an array');
    }

    if (!apiResponse.pagination) {
      throw new Error('Invalid API response: missing pagination field');
    }

    if (!apiResponse.meta) {
      throw new Error('Invalid API response: missing meta field');
    }

    return apiResponse;
  }

  /**
   * Handle API response and extract data
   */
  private handleResponse<T>(response: any): T[] {
    const apiResponse = this.validateResponse<T>(response);
    return apiResponse.data || [];
  }

  /**
   * Get cache key for a request
   */
  private getCacheKey(operation: string, params?: any): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${operation}:${this.scope}:${paramsStr}`;
  }

  /**
   * Get data from cache if available and not expired
   */
  private getFromCache<T>(cacheKey: string): T | null {
    if (!this.cacheEnabled) {
      return null;
    }

    const entry = this.cache.get(cacheKey);
    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(cacheKey: string, data: T): void {
    if (!this.cacheEnabled) {
      return;
    }

    const now = Date.now();
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      expiresAt: now + this.cacheTTL,
    });

    // Clean up expired entries periodically (every 100 cache operations)
    if (this.cache.size > 100) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get current rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  /**
   * Pre-warm cache by loading frequently used data
   * Call this on startup to improve initial response times
   */
  async preWarmCache(): Promise<void> {
    if (!this.cacheEnabled) {
      console.log('[BusinessApiService] Cache pre-warming skipped (caching disabled)');
      return;
    }

    console.log('[BusinessApiService] Pre-warming cache...');
    const startTime = Date.now();

    try {
      // Load frequently used data in parallel
      await Promise.all([
        this.getAllFAQs().catch(err => console.warn('[Pre-warm] Failed to load FAQs:', err.message)),
        this.getCategories().catch(err => console.warn('[Pre-warm] Failed to load categories:', err.message)),
      ]);

      const duration = Date.now() - startTime;
      console.log(`[BusinessApiService] Cache pre-warmed in ${duration}ms`);
    } catch (error: any) {
      console.warn(`[BusinessApiService] Cache pre-warming partially failed: ${error.message}`);
    }
  }

  /**
   * Background cache refresh - refreshes cache entries before they expire
   * Call this periodically to keep cache fresh
   */
  async refreshCache(): Promise<void> {
    if (!this.cacheEnabled) {
      return;
    }

    const now = Date.now();
    const refreshThreshold = this.cacheTTL * 0.8; // Refresh when 80% of TTL has passed

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;

      // If cache entry is 80% expired, refresh it in background
      if (age >= refreshThreshold) {
        // Extract operation and params from cache key
        const [operation, ...rest] = key.split(':');
        const paramsStr = rest.slice(1).join(':');
        const params = paramsStr ? JSON.parse(paramsStr) : {};

        // Refresh in background (don't await)
        this.refreshCacheEntry(operation, params).catch(err => {
          console.warn(`[Cache Refresh] Failed to refresh ${operation}:`, err.message);
        });
      }
    }
  }

  /**
   * Refresh a specific cache entry
   */
  private async refreshCacheEntry(operation: string, params: any): Promise<void> {
    try {
      switch (operation) {
        case 'getAllFAQs':
          await this.getAllFAQs(params.limit, params.offset);
          break;
        case 'getFAQsByCategory':
          await this.getFAQsByCategory(params.category, params.limit, params.offset);
          break;
        case 'searchFAQs':
          await this.searchFAQs(params.query, params.limit, params.offset);
          break;
        case 'getCategories':
          await this.getCategories();
          break;
        default:
          // Unknown operation, skip
          break;
      }
    } catch (error) {
      // Silently fail - cache refresh is best effort
    }
  }

  /**
   * Start background cache refresh interval
   * Refreshes cache entries before they expire
   */
  startCacheRefreshInterval(intervalMs: number = 60000): void {
    if (!this.cacheEnabled) {
      return;
    }

    setInterval(() => {
      this.refreshCache().catch(err => {
        console.warn('[Cache Refresh] Background refresh error:', err.message);
      });
    }, intervalMs);

    console.log(`[BusinessApiService] Background cache refresh started (interval: ${intervalMs}ms)`);
  }

  /**
   * Check if we should wait before making a request (rate limiting)
   */
  private async checkRateLimit(): Promise<void> {
    if (!this.rateLimitEnabled || !this.rateLimitInfo) {
      return;
    }

    // If we've hit the rate limit, wait until reset
    if (this.rateLimitInfo.remaining <= 0) {
      const waitTime = Math.max(0, this.rateLimitInfo.resetAt - Date.now());
      if (waitTime > 0) {
        console.warn(`[Rate Limit] Waiting ${waitTime}ms before next request`);
        await this.sleep(waitTime);
        // Reset rate limit info after waiting
        this.rateLimitInfo = null; // This is not a fallback - it's resetting state after waiting
      }
    }
  }

  /**
   * Fetch all FAQs from the business API with caching and pagination support
   */
  async getAllFAQs(limit?: number, offset?: number): Promise<{ data: FAQData[]; pagination: Pagination }> {
    const cacheKey = this.getCacheKey('getAllFAQs', { limit, offset });

    // Check cache first
    const cached = this.getFromCache<{ data: FAQData[]; pagination: Pagination }>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.checkRateLimit();

      const params: any = {
        scope: this.scope,
      };

      if (limit !== undefined) {
        params.limit = limit;
      }
      if (offset !== undefined) {
        params.offset = offset;
      }

      const response = await this.executeWithRetry<MLabApiResponse<FAQData>>(
        () => this.client.get<MLabApiResponse<FAQData>>('/faqs', { params }),
        'getAllFAQs'
      );

      const validatedResponse = this.validateResponse<FAQData>(response);
      const result = {
        data: validatedResponse.data || [],
        pagination: validatedResponse.pagination,
      };

      // Cache the result
      this.setCache(cacheKey, result);

      return result;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch FAQ data');
      console.error(`[BusinessApiService] Error fetching FAQs: ${errorMessage}`, {
        limit,
        offset,
        scope: this.scope,
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Get improved error message for debugging
   */
  private getErrorMessage(error: any, defaultMessage: string): string {
    if (error.response) {
      const apiError = error.response.data as MLabApiError;
      if (apiError?.message) {
        return `${defaultMessage}: ${apiError.message} (Status: ${error.response.status})`;
      }
      return `${defaultMessage}: HTTP ${error.response.status} - ${error.response.statusText}`;
    }

    if (error.request) {
      return `${defaultMessage}: Network error - API is unreachable. Check your internet connection and API URL (${this.apiUrl})`;
    }

    if (error.message) {
      return `${defaultMessage}: ${error.message}`;
    }

    return defaultMessage;
  }

  /**
   * Fetch FAQs by category with caching
   */
  async getFAQsByCategory(category: string, limit?: number, offset?: number): Promise<FAQData[]> {
    const cacheKey = this.getCacheKey('getFAQsByCategory', { category, limit, offset });

    // Check cache first
    const cached = this.getFromCache<FAQData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.checkRateLimit();

      const params: any = {
        scope: this.scope,
        category: category,
      };

      if (limit !== undefined) {
        params.limit = limit;
      }
      if (offset !== undefined) {
        params.offset = offset;
      }

      const response = await this.executeWithRetry<MLabApiResponse<FAQData>>(
        () => this.client.get<MLabApiResponse<FAQData>>(`/faqs`, { params }),
        `getFAQsByCategory(${category})`
      );

      const result = this.handleResponse<FAQData>(response);

      // Cache the result
      this.setCache(cacheKey, result);

      return result;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch FAQs for category "${category}"`);
      console.error(`[BusinessApiService] ${errorMessage}`, {
        category,
        limit,
        offset,
        scope: this.scope,
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Search FAQs by query string with caching
   */
  async searchFAQs(query: string, limit?: number, offset?: number): Promise<FAQData[]> {
    const cacheKey = this.getCacheKey('searchFAQs', { query, limit, offset });

    // Check cache first
    const cached = this.getFromCache<FAQData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.checkRateLimit();

      const params: any = {
        scope: this.scope,
        q: query,
      };

      if (limit !== undefined) {
        params.limit = limit;
      }
      if (offset !== undefined) {
        params.offset = offset;
      }

      const response = await this.executeWithRetry<MLabApiResponse<FAQData>>(
        () => this.client.get<MLabApiResponse<FAQData>>(`/faqs`, { params }),
        `searchFAQs("${query}")`
      );

      const result = this.handleResponse<FAQData>(response);

      // Cache the result
      this.setCache(cacheKey, result);

      return result;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to search FAQs for query "${query}"`);
      console.error(`[BusinessApiService] ${errorMessage}`, {
        query,
        limit,
        offset,
        scope: this.scope,
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all available categories
   */
  /**
   * Get all FAQ categories
   * Note: The API doesn't have a /faqs/categories endpoint,
   * so we fetch FAQs and extract unique categories from them
   */
  async getCategories(): Promise<string[]> {
    const cacheKey = this.getCacheKey('getCategories');

    // Check cache first
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Fetch all FAQs and extract unique categories
      const result = await this.getAllFAQs();
      const faqs = result.data;

      // Extract unique categories from FAQs
      const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)));
      const sortedCategories = categories.sort();

      // Cache the result
      this.setCache(cacheKey, sortedCategories);

      return sortedCategories;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch categories');
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Type guard to check if response is an error
   */
  private isApiError(data: any): data is MLabApiError {
    return data && typeof data === 'object' && 'error' in data && data.error === true;
  }

  /**
   * Get programme by ID
   */
  async getProgrammeById(programmeId?: string): Promise<Programme> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<any>(
        () => this.client.get<MLabApiSingleResponse<Programme> | MLabApiError>(`/programmes/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getProgrammeById(${id})`
      );

      // Check for error structure
      const responseData = response.data;
      if (this.isApiError(responseData)) {
        throw new Error(`API Error: ${responseData.message} (${responseData.statusCode})`);
      }

      const apiResponse = responseData as MLabApiSingleResponse<Programme>;
      if (!apiResponse?.data) {
        throw new Error(`Programme ${id} not found`);
      }
      return apiResponse.data;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get current programme details
   */
  async getCurrentProgramme(): Promise<Programme> {
    return this.getProgrammeById(this.programId);
  }

  /**
   * Get eligibility criteria for a programme
   */
  async getEligibility(programmeId?: string): Promise<EligibilityCriterion[]> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<MLabApiResponse<EligibilityCriterion>>(
        () => this.client.get<MLabApiResponse<EligibilityCriterion>>(`/eligibility/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getEligibility(${id})`
      );
      return this.handleResponse<EligibilityCriterion>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch eligibility for programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get application process steps for a programme
   */
  async getApplicationProcess(programmeId?: string): Promise<ApplicationStep[]> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<MLabApiResponse<ApplicationStep>>(
        () => this.client.get<MLabApiResponse<ApplicationStep>>(`/application-process/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getApplicationProcess(${id})`
      );
      return this.handleResponse<ApplicationStep>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch application process for programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get curriculum modules for a programme
   */
  async getCurriculum(programmeId?: string): Promise<CurriculumModule[]> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<MLabApiResponse<CurriculumModule>>(
        () => this.client.get<MLabApiResponse<CurriculumModule>>(`/curriculum/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getCurriculum(${id})`
      );
      return this.handleResponse<CurriculumModule>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch curriculum for programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get schedules for a programme
   */
  async getSchedules(programmeId?: string): Promise<Schedule[]> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<MLabApiResponse<Schedule>>(
        () => this.client.get<MLabApiResponse<Schedule>>(`/schedules/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getSchedules(${id})`
      );
      return this.handleResponse<Schedule>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch schedules for programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get policies (optionally filtered by programme)
   */
  async getPolicies(programmeId?: string): Promise<Policy[]> {
    try {
      const params: any = {
        scope: this.scope,
      };

      if (programmeId) {
        params.programme_id = programmeId;
      }

      const response = await this.executeWithRetry<MLabApiResponse<Policy>>(
        () => this.client.get<MLabApiResponse<Policy>>('/policies', {
          params,
        }),
        programmeId ? `getPolicies(${programmeId})` : 'getPolicies'
      );
      return this.handleResponse<Policy>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch policies${programmeId ? ` for programme ${programmeId}` : ''}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all locations
   */
  async getLocations(): Promise<Location[]> {
    try {
      const response = await this.executeWithRetry<MLabApiResponse<Location>>(
        () => this.client.get<MLabApiResponse<Location>>('/locations', {
          params: {
            scope: this.scope,
          },
        }),
        'getLocations'
      );
      return this.handleResponse<Location>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch locations');
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all partners
   */
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await this.executeWithRetry<MLabApiResponse<Partner>>(
        () => this.client.get<MLabApiResponse<Partner>>('/partners', {
          params: {
            scope: this.scope,
          },
        }),
        'getPartners'
      );
      return this.handleResponse<Partner>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch partners');
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get mLab overview/organization information
   */
  async getOverview(): Promise<Overview> {
    try {
      const response = await this.executeWithRetry<any>(
        () => this.client.get<MLabApiSingleResponse<Overview>>('/overview', {
          params: {
            scope: this.scope,
          },
        }),
        'getOverview'
      );

      const responseData = response.data;
      if (this.isApiError(responseData)) {
        throw new Error(`API Error: ${responseData.message} (${responseData.statusCode})`);
      }

      const apiResponse = responseData as MLabApiSingleResponse<Overview>;
      if (!apiResponse?.data) {
        throw new Error('Overview data not found');
      }
      return apiResponse.data;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch overview');
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get financial breakdown for a programme
   */
  async getFinancialBreakdown(programmeId?: string): Promise<FinancialBreakdownItem[]> {
    try {
      const id = programmeId || this.programId;
      const response = await this.executeWithRetry<MLabApiResponse<FinancialBreakdownItem>>(
        () => this.client.get<MLabApiResponse<FinancialBreakdownItem>>(`/financial-breakdown/${id}`, {
          params: {
            scope: this.scope,
          },
        }),
        `getFinancialBreakdown(${id})`
      );
      return this.handleResponse<FinancialBreakdownItem>(response);
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error, `Failed to fetch financial breakdown for programme ${programmeId || this.programId}`);
      console.error(`[BusinessApiService] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify API connectivity on startup
   * Throws an error if connection fails (for startup checks)
   */
  async verifyConnectionOnStartup(): Promise<void> {
    const connectionStatus = await this.testConnection();

    if (!connectionStatus.connected) {
      throw new Error(
        `Business API connection verification failed: ${connectionStatus.error || 'Unknown error'}. ` +
        `API URL: ${connectionStatus.apiUrl}, Scope: ${connectionStatus.scope}`
      );
    }

    console.log(
      `✅ Business API connection verified successfully ` +
      `(URL: ${connectionStatus.apiUrl}, Latency: ${connectionStatus.latency}ms)`
    );
  }

  /**
   * Test API connection and return connection status
   */
  async testConnection(): Promise<{
    connected: boolean;
    apiUrl: string;
    scope: string;
    programId: string;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Try to fetch FAQs as a lightweight test endpoint
      // Using /faqs instead of /faqs/categories since categories endpoint doesn't exist
      await this.executeWithRetry<MLabApiResponse<FAQData>>(
        () => this.client.get<MLabApiResponse<FAQData>>('/faqs', {
          params: {
            scope: this.scope,
            limit: 1, // Only fetch 1 FAQ to minimize data transfer
          },
        }),
        'testConnection'
      );

      const latency = Date.now() - startTime;

      return {
        connected: true,
        apiUrl: this.apiUrl,
        scope: this.scope,
        programId: this.programId,
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      let errorMessage = 'Unknown error';

      if (error.response) {
        const apiError = error.response.data as MLabApiError;
        errorMessage = apiError?.message || `HTTP ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error - API is unreachable';
      } else {
        errorMessage = error.message || 'Unknown error';
      }

      return {
        connected: false,
        apiUrl: this.apiUrl,
        scope: this.scope,
        programId: this.programId,
        latency,
        error: errorMessage,
      };
    }
  }
}
