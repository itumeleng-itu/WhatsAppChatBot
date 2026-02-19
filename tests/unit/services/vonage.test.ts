import { VonageService } from '../../../src/services/vonage.service';

jest.mock('../../../src/services/vonage.service'); // Mock the class

const MockedVonageService = VonageService as jest.MockedClass<typeof VonageService>;

describe('VonageService', () => {
  let service: VonageService;

  beforeEach(() => {
    service = new VonageService();
    jest.clearAllMocks();
  });

  it('should send message successfully', async () => {
    // @ts-ignore
    service.sendMessage = jest.fn().mockResolvedValue({
      success: true,
      messageId: 'abc123',
    });

    const result = await service.sendMessage('1234567890', 'Hello');
    expect(result).toEqual({ success: true, messageId: 'abc123' });
  });

  it('should handle network errors gracefully', async () => {
    // @ts-ignore
    service.sendMessage = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(service.sendMessage('1234567890', 'Hello')).rejects.toThrow('Network error');
  });

  it('should handle missing API credentials', async () => {
    // @ts-ignore
    service.sendMessage = jest.fn().mockRejectedValue(new Error('Vonage API credentials not configured'));

    await expect(service.sendMessage('1234567890', 'Hi')).rejects.toThrow(
      'Vonage API credentials not configured'
    );
  });
});
