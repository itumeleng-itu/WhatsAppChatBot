import { Ollama } from 'ollama';
import { BusinessApiService, FAQData } from './business-api.service';
import { getSystemPrompt, getUserPromptTemplate, isOutOfScope } from '../config/model.config';

export interface OllamaConfig {
  model: string;
  temperature: number;
  maxTokens?: number;
  systemPrompt: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Service to interact with Ollama for humanized responses
 * Configured with strict scope constraints
 */
export class OllamaService {
  private ollama: Ollama;
  private config: OllamaConfig;
  private businessApi: BusinessApiService;

  constructor() {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.ollama = new Ollama({ host: ollamaUrl });
    this.businessApi = new BusinessApiService();
    
    // Configure the model with strict scope constraints
    this.config = {
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      temperature: 0.7, // Lower temperature for more consistent, focused responses
      maxTokens: 500, // Limit response length for WhatsApp-friendly messages
      systemPrompt: this.getSystemPrompt(),
    };
  }

  /**
   * Get the system prompt with strict scope constraints
   */
  private getSystemPrompt(): string {
    return getSystemPrompt();
  }

  /**
   * Generate a humanized response using Ollama
   */
  async generateResponse(
    userQuery: string,
    contextFAQs?: FAQData[]
  ): Promise<{ response: string; confidence: number }> {
    try {
      // Fetch relevant FAQs if not provided
      let relevantFAQs = contextFAQs;
      if (!relevantFAQs || relevantFAQs.length === 0) {
        relevantFAQs = await this.businessApi.searchFAQs(userQuery);
      }

      // Build context from FAQs
      const context = this.buildContextFromFAQs(relevantFAQs);

      // Create messages for Ollama
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.config.systemPrompt,
        },
        {
          role: 'user',
          content: this.buildUserPrompt(userQuery, context),
        },
      ];

      // Generate response
      const response = await this.ollama.chat({
        model: this.config.model,
        messages: messages,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens || 500,
        },
      });

      const generatedText = response.message.content.trim();

      // Calculate confidence score
      const confidence = this.calculateConfidence(relevantFAQs, userQuery);

      return {
        response: generatedText,
        confidence,
      };
    } catch (error) {
      console.error('Error generating response with Ollama:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Build context string from FAQs
   */
  private buildContextFromFAQs(faqs: FAQData[]): string {
    if (faqs.length === 0) {
      return 'No relevant data found in the database for this query.';
    }

    return faqs
      .map(
        (faq) => `
Category: ${faq.category}
Q: ${faq.question}
A: ${faq.answer}
`
      )
      .join('\n---\n');
  }

  /**
   * Build the user prompt with context
   */
  private buildUserPrompt(userQuery: string, context: string): string {
    return getUserPromptTemplate()
      .replace('{query}', userQuery)
      .replace('{context}', context);
  }

  /**
   * Calculate confidence score based on FAQ relevance
   */
  private calculateConfidence(faqs: FAQData[], userQuery: string): number {
    if (faqs.length === 0) return 0.2;

    const queryWords = userQuery.toLowerCase().split(/\s+/);
    let maxMatchScore = 0;

    for (const faq of faqs) {
      const faqText = `${faq.question} ${faq.answer}`.toLowerCase();
      const matchCount = queryWords.filter((word) => faqText.includes(word)).length;
      const matchScore = matchCount / queryWords.length;
      maxMatchScore = Math.max(maxMatchScore, matchScore);
    }

    return Math.min(maxMatchScore, 1.0);
  }

  /**
   * Update model configuration
   */
  updateConfig(config: Partial<OllamaConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.systemPrompt) {
      this.config.systemPrompt = config.systemPrompt;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): OllamaConfig {
    return { ...this.config };
  }
}
