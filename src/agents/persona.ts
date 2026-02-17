import { OllamaService } from '../services/ollama.service';
import { BusinessApiService, FAQData } from '../services/business-api.service';
import { QueryLogger } from '../services/query-logger.service';

export interface ChatResponse {
  message: string;
  confidence: number;
  category?: string;
}

/**
 * Persona/Agent configuration for the WhatsApp bot
 * Ensures responses stay within scope and are humanized
 */
export class PersonaAgent {
  private ollamaService: OllamaService;
  private businessApi: BusinessApiService;
  private queryLogger: QueryLogger;

  constructor() {
    this.ollamaService = new OllamaService();
    this.businessApi = new BusinessApiService();
    this.queryLogger = new QueryLogger();
  }

  /**
   * Process a learner query and generate an appropriate response
   */
  async processQuery(
    learnerId: string,
    query: string
  ): Promise<ChatResponse> {
    try {
      // Log the incoming query
      await this.queryLogger.logQuery(learnerId, query);

      // Fetch relevant FAQs from business API
      const relevantFAQs = await this.businessApi.searchFAQs(query);

      // Generate humanized response using Ollama
      const ollamaResponse = await this.ollamaService.generateResponse(
        query,
        relevantFAQs
      );

      // Determine category
      const category = this.determineCategory(relevantFAQs, query);

      // If no FAQs found and confidence is very low, ensure friendly response
      if (relevantFAQs.length === 0 && ollamaResponse.confidence < 0.3) {
        // The AI should already handle this via prompts, but this ensures it
        // Check if response doesn't seem friendly enough
        const responseLower = ollamaResponse.response.toLowerCase();
        if (!responseLower.includes('couldn\'t find') && 
            !responseLower.includes('no information') && 
            !responseLower.includes('not found') &&
            !responseLower.includes('rephrasing')) {
          // Override with friendly message if AI didn't follow instructions
          ollamaResponse.response = "I couldn't find specific information about that in our database. Could you try rephrasing your question or ask about FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, or Locations?";
        }
      }

      // Log the response
      await this.queryLogger.logResponse(
        learnerId,
        query,
        ollamaResponse.response,
        ollamaResponse.confidence,
        category
      );

      return {
        message: ollamaResponse.response,
        confidence: ollamaResponse.confidence,
        category,
      };
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Fallback response
      return {
        message: 'I apologize, but I encountered an error. Please try again.',
        confidence: 0,
      };
    }
  }

  /**
   * Determine the category of the query
   */
  private determineCategory(faqs: FAQData[], query: string): string | undefined {
    if (faqs.length === 0) return undefined;

    // Count category occurrences
    const categoryCount: Record<string, number> = {};
    faqs.forEach((faq) => {
      categoryCount[faq.category] = (categoryCount[faq.category] || 0) + 1;
    });

    // Return most common category
    return Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  }

  /**
   * Get available categories for help
   */
  async getAvailableCategories(): Promise<string[]> {
    return await this.businessApi.getCategories();
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category: string): Promise<FAQData[]> {
    return await this.businessApi.getFAQsByCategory(category);
  }
}
