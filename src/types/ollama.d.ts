declare module 'ollama' {
    export interface ChatMessage {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }

    export interface OllamaOptions {
        host?: string;
    }

    export interface ChatOptions {
        model: string;
        messages: ChatMessage[];
        options?: Record<string, any>;
    }

    export interface ChatResult {
        message: { content: string };
    }

    export class Ollama {
        constructor(options?: OllamaOptions);
        chat(options: ChatOptions): Promise<ChatResult>;
    }
}
