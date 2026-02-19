import { Ollama } from 'ollama';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface GenerateResponseResult {
  response: string;
  confidence: number;
}

export class OllamaService {
  private ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      host: 'http://localhost:11434', // adjust if needed
    });
  }

  async generateResponse(
    userMessage: string,
    faqs: FAQ[]
  ): Promise<GenerateResponseResult> {
    const faqContext =
      faqs.length > 0
        ? faqs
            .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
            .join('\n\n')
        : 'No FAQs available.';

    const prompt = `
You are a helpful assistant.

Here are some FAQs:
${faqContext}

User Question:
${userMessage}

Answer clearly and concisely.
`;

    const result = await this.ollama.chat({
      model: 'llama3',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = result?.message?.content ?? '';

    // Simple confidence logic
    let confidence = 0.2;

    if (faqs.length === 0) {
      confidence = 0.2;
    } else {
      const matched = faqs.some((faq) =>
        userMessage.toLowerCase().includes(faq.question.toLowerCase())
      );

      confidence = matched ? 0.8 : 0.4;
    }

    return {
      response,
      confidence,
    };
  }
}
