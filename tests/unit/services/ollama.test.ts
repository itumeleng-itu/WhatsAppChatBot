import { OllamaService } from '../../../src/services/ollama.service';
import { Ollama } from 'ollama';

jest.mock('ollama');

describe('OllamaService', () => {
  let service: OllamaService;
  let mockChat: jest.Mock;

  beforeEach(() => {
    mockChat = jest.fn();

    // Mock the Ollama constructor
    (Ollama as jest.Mock).mockImplementation(() => ({
      chat: mockChat,
    }));

    service = new OllamaService();
    jest.clearAllMocks();
  });

  it('should return low confidence (< 0.3) when FAQs array is empty', async () => {
    mockChat.mockResolvedValue({
      message: { content: 'I am not sure about that.' },
    });

    const result = await service.generateResponse('Tell me about Node.js', []);

    expect(result.confidence).toBeLessThan(0.3);
    expect(result.response).toContain('not sure');
    expect(mockChat).toHaveBeenCalledTimes(1);
  });

  it('should return high confidence (>= 0.7) when FAQs match', async () => {
    const faqs = [
      { id: '1', category: 'js', question: 'What is Node.js?', answer: 'A runtime environment for JS.' },
    ];

    mockChat.mockResolvedValue({
      message: { content: 'Node.js is a runtime environment for JavaScript.' },
    });

    const result = await service.generateResponse('What is Node.js?', faqs);

    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.response).toContain('Node.js');
    expect(mockChat).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response gracefully', async () => {
    mockChat.mockResolvedValue({
      message: { content: '' },
    });

    const result = await service.generateResponse('Any question?', []);

    expect(result.confidence).toBeLessThanOrEqual(0.2);
    expect(result.response).toBe('');
  });
});
