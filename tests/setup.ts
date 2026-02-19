import dotenv from 'dotenv';

dotenv.config();

process.env.OLLAMA_BASE_URL ||= 'http://localhost:11434';
process.env.VONAGE_API_KEY ||= 'test_key';
process.env.VONAGE_API_SECRET ||= 'test_secret';
process.env.VONAGE_WHATSAPP_NUMBER ||= '1234567890';

jest.setTimeout(30000);
