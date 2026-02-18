import { OllamaService } from '../services/ollama.service';
import { BusinessApiService, FAQData } from '../services/business-api.service';
import { QueryLogger } from '../services/query-logger.service';
import { isOutOfScope } from '../config/model.config';

export interface ChatResponse {
  message: string;
  confidence: number;
  category?: string;
}

// Sent when a query is clearly not about CodeTribe
const OUT_OF_SCOPE_REPLY =
  "I'm only able to answer questions about CodeTribe Academy — things like eligibility, how to apply, the curriculum, and programme policies. What would you like to know about CodeTribe? 😊";

// Sent when no relevant FAQs are found at all
const NO_INFO_REPLY =
  "I don't have specific information about that right now. For the most accurate answer, please reach out to the CodeTribe team directly.";

export class PersonaAgent {
  private ollamaService: OllamaService;
  private businessApi: BusinessApiService;
  private queryLogger: QueryLogger;

  constructor() {
    this.ollamaService = new OllamaService();
    this.businessApi = new BusinessApiService();
    this.queryLogger = new QueryLogger();
  }

  async processQuery(learnerId: string, query: string): Promise<ChatResponse> {
    await this.queryLogger.logQuery(learnerId, query);

    // ── 1. Fast out-of-scope guard (no Ollama call needed) ──────────────────
    if (isOutOfScope(query)) {
      await this.queryLogger.logResponse(learnerId, query, OUT_OF_SCOPE_REPLY, 0, 'out_of_scope');
      return { message: OUT_OF_SCOPE_REPLY, confidence: 0, category: 'out_of_scope' };
    }

    // ── 2. Fetch relevant FAQs ───────────────────────────────────────────────
    // Try category-based search first for better results
    let faqs = await this.fetchFAQsByCategoryOrQuery(query);
    
    // If no FAQs found, try direct search
    if (faqs.length === 0) {
      faqs = await this.businessApi.searchFAQs(query);
    }
    
    // Fallback: if search returned nothing, try broader keyword search
    // This handles cases where the API search doesn't filter server-side
    if (faqs.length === 0) {
      const keywords = this.extractKeywords(query);
      if (keywords.length > 0) {
        faqs = await this.businessApi.searchFAQs(keywords.join(' '));
      }
    }

    // ── 4. Short-circuit: no FAQs at all → polite "no info" reply ───────────
    if (faqs.length === 0) {
      await this.queryLogger.logResponse(learnerId, query, NO_INFO_REPLY, 0.1, undefined);
      return { message: NO_INFO_REPLY, confidence: 0.1 };
    }

    // ── 5. Generate response via Ollama (FAQs are ranked + trimmed inside) ──
    const { response, confidence } = await this.ollamaService.generateResponse(query, faqs);
    const category = this.determineCategory(faqs, query);

    await this.queryLogger.logResponse(learnerId, query, response, confidence, category);

    return { message: response, confidence, category };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private determineCategory(faqs: FAQData[], _query: string): string | undefined {
    if (faqs.length === 0) return undefined;
    const counts: Record<string, number> = {};
    for (const faq of faqs) {
      counts[faq.category] = (counts[faq.category] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }

  /**
   * Try to fetch FAQs by category if query matches common category terms.
   * This improves results for queries like "eligibility", "curriculum", etc.
   */
  private async fetchFAQsByCategoryOrQuery(query: string): Promise<FAQData[]> {
    const queryLower = query.toLowerCase();
    
    // Map query terms to FAQ categories
    const categoryMap: Record<string, string[]> = {
      'eligibility': ['eligibility'],
      'eligible': ['eligibility'],
      'requirements': ['eligibility'],
      'apply': ['application', 'eligibility'],
      'application': ['application', 'eligibility'],
      'applicant': ['application'],
      'curriculum': ['programme_details'],
      'course': ['programme_details'],
      'programme': ['programme_details'],
      'program': ['programme_details'],
      'schedule': ['logistics'],
      'time': ['logistics'],
      'when': ['logistics'],
      'location': ['logistics'],
      'where': ['logistics'],
      'venue': ['logistics'],
      'cost': ['financial'],
      'price': ['financial'],
      'money': ['financial'],
      'payment': ['financial'],
      'fee': ['financial'],
      'stipend': ['financial'],
      'policy': ['policies'],
      'rule': ['policies'],
      'policies': ['policies'],
    };

    // Check if query contains category keywords
    const matchingCategories = new Set<string>();
    const queryWords = queryLower.split(/\s+/);
    
    for (const word of queryWords) {
      const cleanWord = word.replace(/[^a-z0-9]/g, '');
      if (categoryMap[cleanWord]) {
        categoryMap[cleanWord].forEach(cat => matchingCategories.add(cat));
      }
    }

    // If we found matching categories, fetch FAQs from those categories
    if (matchingCategories.size > 0) {
      const allCategoryFAQs: FAQData[] = [];
      for (const category of matchingCategories) {
        try {
          const categoryFAQs = await this.businessApi.getFAQsByCategory(category);
          allCategoryFAQs.push(...categoryFAQs);
        } catch (error) {
          // Category might not exist, continue
        }
      }
      if (allCategoryFAQs.length > 0) {
        return allCategoryFAQs;
      }
    }

    return []; // No category match, return empty to trigger regular search
  }

  /**
   * Extract the most meaningful words from a query for a fallback search.
   * Mirrors the stop-word list in OllamaService to stay consistent.
   */
  private extractKeywords(query: string): string[] {
    const stopWords = new Set([
      'a','an','the','is','are','was','were','be','been','do','does','did',
      'will','would','could','should','can','what','how','when','where','who',
      'why','i','me','my','we','you','your','it','its','this','that','and',
      'or','but','if','in','on','at','to','for','of','with','by','from',
    ]);
    return query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
  }

  async getAvailableCategories(): Promise<string[]> {
    return this.businessApi.getCategories();
  }

  async getFAQsByCategory(category: string): Promise<FAQData[]> {
    return this.businessApi.getFAQsByCategory(category);
  }
}