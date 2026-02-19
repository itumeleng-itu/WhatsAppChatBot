import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export interface VonageMessage {
  from: string;
  message: string;
  messageId: string;
  timestamp: string;
}

export interface VonageSendMessageRequest {
  from: string;
  to: string;
  channel: 'whatsapp';
  message_type: 'text' | 'custom';
  text?: string;
  custom?: any;
}

/**
 * Service to interact with Vonage API for sending WhatsApp messages
 */
export class VonageService {
  private client: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;
  private fromNumber: string;

  constructor() {
    this.apiKey = process.env.VONAGE_API_KEY || '';
    this.apiSecret = process.env.VONAGE_API_SECRET || '';
    this.apiUrl = process.env.VONAGE_API_URL || 'https://api.nexmo.com';
    this.fromNumber = process.env.VONAGE_WHATSAPP_NUMBER || '';

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.apiKey,
        password: this.apiSecret,
      },
    });

    console.log('VonageConfig:', {
      apiUrl: this.apiUrl,
      fromNumber: this.fromNumber,
      usingSandbox: this.apiUrl.includes('sandbox')
    });
  }

  /**
   * Parse incoming Vonage webhook message
   */
  parseIncomingMessage(body: any): {
    from: string;
    message: string;
    messageId: string;
    timestamp: string;
  } | null {
    try {
      // Handle Vonage webhook format - Interactive
      if (body.message?.content?.type === 'interactive') {
        const interactive = body.message.content.interactive;
        // title is usually the button text
        const buttonTitle = interactive.button_reply?.title || interactive.list_reply?.title;
        return {
          from: body.from?.number || body.from,
          message: buttonTitle || 'Interactive Response',
          messageId: body.message_uuid || body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Handle Vonage webhook format - Text
      if (body.message?.content?.type === 'text' && body.message?.content?.text) {
        return {
          from: body.from?.number || body.from,
          message: body.message.content.text,
          messageId: body.message_uuid || body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Handle Sandbox flat format (v1 Messages API) - Interactive
      if (body.message_type === 'interactive' && body.interactive) {
        const buttonTitle = body.interactive.button_reply?.title || body.interactive.list_reply?.title;
        return {
          from: body.from,
          message: buttonTitle || 'Interactive Response',
          messageId: body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Handle Sandbox flat format (v1 Messages API) - Text
      if (body.message_type === 'text' && body.text) {
        return {
          from: body.from,
          message: body.text,
          messageId: body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Handle Sandbox flat format (v1 Messages API) - Reply (from List Messages)
      if (body.message_type === 'reply' && body.reply) {
        return {
          from: body.from,
          message: body.reply.title || 'Reply Response',
          messageId: body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Try alternative format (legacy)
      if (body.from && body.message) {
        const fromValue = typeof body.from === 'string' ? body.from : body.from.number;
        const messageValue = typeof body.message === 'string'
          ? body.message
          : body.message.text || body.message.content?.text;

        if (!fromValue || !messageValue) {
          throw new Error('Invalid message format: missing from or message field');
        }

        return {
          from: fromValue,
          message: messageValue,
          messageId: body.message_uuid || body.messageId || '',
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      throw new Error('Invalid webhook payload: missing required fields (from, message)');
    } catch (error: any) {
      console.error('Error parsing Vonage message:', error);
      // Return null instead of throwing, so caller can decide
      return null;
    }
  }

  /**
   * Send a WhatsApp message via Vonage API
   */
  async sendMessage(to: string, text: string): Promise<{ messageId: string }> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Vonage API credentials not configured');
      }

      if (!this.fromNumber) {
        throw new Error('Vonage WhatsApp number not configured');
      }

      const request: VonageSendMessageRequest = {
        from: this.fromNumber,
        to,
        message_type: 'text',
        text,
        channel: 'whatsapp',
      };

      console.log('Sending Vonage Request:', JSON.stringify(request, null, 2));
      console.log('Target URL:', this.client.defaults.baseURL);
      const response = await this.client.post<{ message_uuid: string }>('/v1/messages', request);

      return {
        messageId: response.data.message_uuid,
      };
    } catch (error: any) {
      console.error('Error sending message via Vonage:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      if (!errorMessage) {
        throw new Error('Failed to send message via Vonage: Unknown error');
      }
      throw new Error(`Failed to send message via Vonage: ${errorMessage}`);
    }
  }

  /**
   * Send a custom (interactive) WhatsApp message via Vonage API
   */
  async sendCustomMessage(to: string, customPayload: any): Promise<{ messageId: string }> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Vonage API credentials not configured');
      }
      if (!this.fromNumber) throw new Error('Vonage WhatsApp number not configured');

      const request: VonageSendMessageRequest = {
        from: this.fromNumber,
        to,
        channel: 'whatsapp',
        message_type: 'custom',
        custom: customPayload
      };

      console.log('Sending Vonage Custom Request:', JSON.stringify(request, null, 2));
      const response = await this.client.post<{ message_uuid: string }>('/v1/messages', request);
      return { messageId: response.data.message_uuid };
    } catch (error: any) {
      console.error('Error sending custom message via Vonage:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(`Failed to send custom message via Vonage: ${errorMessage}`);
    }
  }

  /**
   * Validate webhook signature (optional but recommended)
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    if (!process.env.VONAGE_SIGNATURE_SECRET) return true;

    // Implementation depends on Vonage signature algorithm
    // Placeholder
    return true;
  }
}
