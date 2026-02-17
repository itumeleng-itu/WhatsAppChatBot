import axios, { AxiosInstance } from 'axios';

export interface VonageMessage {
  message_uuid: string;
  timestamp: string;
  to: {
    type: string;
    number: string;
  };
  from: {
    type: string;
    number: string;
  };
  message: {
    content: {
      type: string;
      text?: string;
    };
  };
}

export interface VonageSendMessageRequest {
  to: string;
  from: string;
  message: {
    content: {
      type: 'text';
      text: string;
    };
  };
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
      baseURL: `${this.apiUrl}/v1/messages`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.apiKey,
        password: this.apiSecret,
      },
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
      // Handle Vonage webhook format
      if (body.message?.content?.type === 'text' && body.message?.content?.text) {
        return {
          from: body.from?.number || body.from,
          message: body.message.content.text,
          messageId: body.message_uuid || body.message_uuid,
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      // Fallback for different formats
      if (body.from && body.message) {
        return {
          from: typeof body.from === 'string' ? body.from : body.from.number,
          message: typeof body.message === 'string' ? body.message : body.message.text || body.message.content?.text,
          messageId: body.message_uuid || body.messageId || '',
          timestamp: body.timestamp || new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing Vonage message:', error);
      return null;
    }
  }

  /**
   * Send a WhatsApp message via Vonage API
   */
  async sendMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Vonage API credentials not configured');
      }

      if (!this.fromNumber) {
        throw new Error('Vonage WhatsApp number not configured');
      }

      const request: VonageSendMessageRequest = {
        to,
        from: this.fromNumber,
        message: {
          content: {
            type: 'text',
            text,
          },
        },
      };

      const response = await this.client.post('', request);

      return {
        success: true,
        messageId: response.data.message_uuid,
      };
    } catch (error: any) {
      console.error('Error sending message via Vonage:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to send message',
      };
    }
  }

  /**
   * Validate webhook signature (optional but recommended)
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Implement signature validation if needed
    // Vonage uses JWT Bearer tokens with HMAC-SHA256
    // For now, return true - implement proper validation in production
    return true;
  }
}
