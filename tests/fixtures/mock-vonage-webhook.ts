// tests/mocks/mock-vonage-webhooks.ts

export const mockVonageIncomingMessage = {
  message_uuid: '123e4567-e89b-12d3-a456-426614174000',
  timestamp: '2026-02-18T12:34:56Z',
  to: '15551234567',
  from: '15557654321',
  message: {
    content: 'Hello, this is a test message!',
  },
};

export const mockVonageButtonClick = {
  message_uuid: '987e6543-e21b-12d3-a456-426614174999',
  timestamp: '2026-02-18T12:45:00Z',
  to: '15551234567',
  from: '15557654321',
  message: {
    content: 'BUTTON_CLICK: CONFIRM',
  },
};
