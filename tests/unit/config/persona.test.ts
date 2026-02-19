import { PersonaAgent } from '../../../src/agents/persona';
import { FAQData } from '../../../src/services/business-api.service';

describe('PersonaAgent', () => {
  let agent: PersonaAgent;

  const mockSearchFAQs = jest.fn();
  const mockGenerateResponse = jest.fn();
  const mockLogQuery = jest.fn();
  const mockLogResponse = jest.fn();
  const mockGetCategories = jest.fn();

  beforeEach(() => {
    agent = new PersonaAgent();

    // 🔥 Inject mocks into private properties
    (agent as any).businessApi = {
      searchFAQs: mockSearchFAQs,
      getCategories: mockGetCategories,
      getFAQsByCategory: jest.fn(),
    };

    (agent as any).ollamaService = {
      generateResponse: mockGenerateResponse,
    };

    (agent as any).queryLogger = {
      logQuery: mockLogQuery,
      logResponse: mockLogResponse,
    };

    jest.clearAllMocks();
  });

  // =====================================================
  // ✅ processQuery — Happy Path
  // =====================================================
  it('should call searchFAQs → generateResponse → logQuery → logResponse and return message + confidence + category', async () => {
    const fakeFAQs: FAQData[] = [
      {
        id: '1',
        question: 'What is Node?',
        answer: 'Runtime',
        category: 'tech',
      },
    ];

    mockSearchFAQs.mockResolvedValue(fakeFAQs);

    mockGenerateResponse.mockResolvedValue({
      response: 'Node is a runtime.',
      confidence: 0.85,
    });

    const result = await agent.processQuery(
      'learner-123',
      'What is Node?'
    );

    // Service call order verification
    expect(mockSearchFAQs).toHaveBeenCalledWith('What is Node?');

    expect(mockGenerateResponse).toHaveBeenCalledWith(
      'What is Node?',
      fakeFAQs
    );

    expect(mockLogQuery).toHaveBeenCalledWith(
      'learner-123',
      'What is Node?'
    );

    expect(mockLogResponse).toHaveBeenCalledWith(
      'learner-123',
      'What is Node?',
      'Node is a runtime.',
      0.85,
      'tech'
    );

    expect(result).toEqual({
      message: 'Node is a runtime.',
      confidence: 0.85,
      category: 'tech',
    });
  });


  it('should return graceful apology message with confidence 0 if searchFAQs throws error', async () => {
    mockSearchFAQs.mockRejectedValue(new Error('API error'));

    const result = await agent.processQuery(
      'learner-123',
      'Test question'
    );

    expect(result).toEqual({
      message: 'I apologize, but I encountered an error. Please try again.',
      confidence: 0,
    });

    expect(mockGenerateResponse).not.toHaveBeenCalled();
    expect(mockLogResponse).not.toHaveBeenCalled();
  });


  it('should delegate to BusinessApiService.getCategories', async () => {
    const categories = ['tech', 'finance'];

    mockGetCategories.mockResolvedValue(categories);

    const result = await agent.getAvailableCategories();

    expect(mockGetCategories).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });
});
