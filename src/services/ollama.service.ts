import { Ollama } from 'ollama';
import { BusinessApiService, FAQData } from './business-api.service';
import { getSystemPrompt, getUserPromptTemplate } from '../config/model.config';

<<<<<<< Updated upstream
interface OllamaConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// How many FAQs to pass as context. Keep this LOW — llama3.2 degrades with large
// contexts and takes much longer to respond. 3–5 highly-relevant FAQs is optimal.
const MAX_CONTEXT_FAQS = 5;

export class OllamaService {
  private ollama: Ollama;
  private config: OllamaConfig;
=======
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export class OllamaService {
  private ollama: Ollama;
>>>>>>> Stashed changes
  private businessApi: BusinessApiService;
  private config: OllamaConfig;
  private requestTimeoutMs: number;
  private readonly MAX_CONTEXT_FAQS = 5;

  constructor() {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    this.ollama = new Ollama({ host: ollamaUrl });
    this.businessApi = new BusinessApiService();
    this.requestTimeoutMs = parseInt(
      process.env.OLLAMA_REQUEST_TIMEOUT_MS || '120000',
      10
    );
    this.config = {
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || '0.3'),
      maxTokens: parseInt(process.env.OLLAMA_MAX_TOKENS || '400', 10),
      systemPrompt: getSystemPrompt(),
    };
  }

  async generateResponse(
    userQuery: string,
    contextFAQs?: FAQData[]
  ): Promise<{ response: string; confidence: number }> {
    // Fetch FAQs if not provided
    let faqs = contextFAQs ?? (await this.businessApi.searchFAQs(userQuery));

    // Rank and keep top N
    faqs = this.rankFAQsByRelevance(faqs, userQuery).slice(0, this.MAX_CONTEXT_FAQS);

    const context = this.buildContext(faqs, userQuery);

    const messages: ChatMessage[] = [
      { role: 'system', content: this.config.systemPrompt },
      { role: 'user', content: this.buildUserPrompt(userQuery, context) },
    ];

    const raw = await this.withTimeout(
      this.ollama.chat({
        model: this.config.model,
        messages,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
          stop: ['\n\nUser:', '\n\nQ:', '---'],
        },
      }),
      this.requestTimeoutMs,
      'Ollama chat'
    );

    const response = raw.message.content.trim();

    return {
      response,
      confidence: this.calculateConfidence(faqs, userQuery),
    };
  }

  private rankFAQsByRelevance(faqs: FAQData[], userQuery: string): FAQData[] {
<<<<<<< Updated upstream
    // Normalise + remove common stop words so "what is the" doesn't dilute scores
    const stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'what', 'how',
      'when', 'where', 'who', 'which', 'why', 'i', 'me', 'my', 'we', 'you', 'your',
      'it', 'its', 'this', 'that', 'these', 'those', 'and', 'or', 'but', 'if', 'in',
      'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into', 'than',
    ]);

    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    // Category matching: map common query terms to FAQ categories
    const categoryMap: Record<string, string[]> = {
      'eligibility': ['eligibility'],
      'apply': ['application', 'eligibility'],
      'application': ['application', 'eligibility'],
      'curriculum': ['programme_details'],
      'course': ['programme_details'],
      'schedule': ['logistics'],
      'time': ['logistics'],
      'location': ['logistics'],
      'where': ['logistics'],
      'cost': ['financial'],
      'price': ['financial'],
      'money': ['financial'],
      'payment': ['financial'],
      'policy': ['policies'],
      'rule': ['policies'],
      'policies': ['policies'],
    };

    // Find matching categories
    const matchingCategories = new Set<string>();
    for (const word of queryWords) {
      if (categoryMap[word]) {
        categoryMap[word].forEach(cat => matchingCategories.add(cat));
      }
    }

    const scored = faqs.map((faq) => {
      const haystack = `${faq.question} ${faq.answer}`.toLowerCase();
      const questionHaystack = faq.question.toLowerCase();

      let score = 0;

      // Category match bonus (high priority)
      if (matchingCategories.size > 0 && faq.category && matchingCategories.has(faq.category)) {
        score += 10; // Strong category match
      }

      // Text matching
      if (queryWords.length > 0) {
        for (const word of queryWords) {
          if (questionHaystack.includes(word)) score += 2; // question match = 2 pts
          else if (haystack.includes(word)) score += 1; // answer-only match = 1 pt
        }
      }

      // Partial word matching (for plurals/similar words)
      for (const word of queryWords) {
        if (word.length > 4) { // Only for longer words
          const stem = word.substring(0, word.length - 1); // Remove last char (handles plurals)
          if (questionHaystack.includes(stem) || haystack.includes(stem)) {
            score += 0.5;
          }
        }
      }

      return { faq, score };
    });

    // Sort by score, but keep ALL FAQs (don't filter score 0)
    // This ensures we always have context, even if ranking is imperfect
    return scored
=======
    const queryWords = userQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    return faqs
      .map((faq) => {
        const text = `${faq.question} ${faq.answer}`.toLowerCase();
        let score = queryWords.filter((w) => text.includes(w)).length;
        return { faq, score };
      })
>>>>>>> Stashed changes
      .sort((a, b) => b.score - a.score)
      .map((s) => s.faq);
  }

  private buildContext(faqs: FAQData[], userQuery: string): string {
    if (!faqs.length) return 'No relevant information found in the knowledge base.';
    return faqs.map((faq, i) => `[${i + 1}] Q: ${faq.question}\n    A: ${faq.answer.trim()}`).join('\n\n');
  }

  private buildUserPrompt(userQuery: string, context: string): string {
    try {
      return getUserPromptTemplate()
        .replace('{query}', userQuery)
        .replace('{context}', context);
    } catch {
      return `KNOWLEDGE BASE (use ONLY this to answer):
${context}

LEARNER QUESTION: ${userQuery}

Instructions:
- Answer directly using the knowledge base above.
- Concise 2–4 sentences.
- Say if info is missing and suggest contacting support.
- Friendly WhatsApp tone, no markdown headers.`;
    }
  }

  private calculateConfidence(faqs: FAQData[], userQuery: string): number {
    if (!faqs.length) return 0.2;
    const queryWords = userQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    let maxScore = 0;
    for (const faq of faqs) {
      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      const matches = queryWords.filter((w) => text.includes(w)).length;
      maxScore = Math.max(maxScore, matches / queryWords.length);
    }
    return Math.min(maxScore, 1.0);
  }

  private withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${operation} timed out after ${ms}ms.`));
      }, ms);
      promise.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
    });
  }

  updateConfig(config: Partial<OllamaConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): OllamaConfig {
    return { ...this.config };
  }
}
