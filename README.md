# CodeTribe Academy Learner Support WhatsApp Bot

A WhatsApp-based chatbot that provides instant, consistent learner support for CodeTribe Academy using AI (Ollama) to humanize responses while maintaining strict scope constraints. Integrated with **Vonage API** for WhatsApp messaging.

## Features

- 🤖 **AI-Powered Responses**: Uses Ollama to generate humanized, natural responses
- 📚 **FAQ Integration**: Fetches data from business API for accurate information
- 🚫 **Scope Enforcement**: Strict configuration prevents out-of-scope responses
- 📊 **Query Logging**: Comprehensive logging for QA purposes
- 📱 **Vonage Integration**: WhatsApp messaging via Vonage API

## Project Structure

```
WhatsAppChatBot/
├── server.ts                 # Main server entry point
├── src/
│   ├── agents/
│   │   └── persona.ts        # Main agent/persona logic
│   ├── config/
│   │   └── model.config.ts   # Model constraints and prompts
│   ├── routes/
│   │   ├── whatsapp.routes.ts # WhatsApp webhook routes
│   │   └── mlab.routes.ts     # Logging and QA routes
│   └── services/
│       ├── business-api.service.ts  # Business API integration
│       ├── ollama.service.ts        # Ollama AI service
│       ├── vonage.service.ts        # Vonage API integration
│       └── query-logger.service.ts  # Query logging
├── logs/                     # Query and response logs
├── package.json
└── tsconfig.json
```

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Ollama installed and running locally or remotely
- Business API endpoint available
- Vonage API account with WhatsApp enabled

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=3000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
BUSINESS_API_URL=http://your-business-api-url/api

# Vonage API Configuration
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_API_URL=https://api.nexmo.com
VONAGE_WHATSAPP_NUMBER=your_vonage_whatsapp_number
```

5. Ensure Ollama is running and the model is available:
```bash
ollama pull llama3.2
```

## Configuration

### Model Configuration

The model is configured with strict scope constraints in `src/config/model.config.ts`:

- **In Scope**: FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, Locations
- **Out of Scope**: Grading, disciplinary decisions, academic record updates

### Scope Enforcement

The bot is configured to:
1. ✅ Answer questions within scope using provided data
2. ❌ Decline out-of-scope queries politely
3. 📝 Log all queries and responses for QA

## API Endpoints

### Vonage WhatsApp Webhook
```
POST /api/whatsapp/webhook
GET /api/whatsapp/webhook (for webhook verification)

Vonage sends messages in this format:
{
  "message_uuid": "...",
  "from": { "type": "whatsapp", "number": "..." },
  "to": { "type": "whatsapp", "number": "..." },
  "message": {
    "content": {
      "type": "text",
      "text": "message text"
    }
  }
}
```

### Chat Endpoint (for testing)
```
POST /api/whatsapp/chat
Body: { learnerId, query }
```

### Health Check
```
GET /api/whatsapp/health
```

### Categories
```
GET /api/whatsapp/categories
```

### Logs
```
GET /api/mlab/logs/queries?date=2024-01-01
GET /api/mlab/logs/responses?date=2024-01-01
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing the Chat

```bash
curl -X POST http://localhost:3000/api/whatsapp/chat \
  -H "Content-Type: application/json" \
  -d '{
    "learnerId": "learner123",
    "query": "What are the attendance requirements?"
  }'
```

## Scope Management

### How Scope is Enforced

1. **System Prompt**: Strict instructions in the Ollama system prompt
2. **Keyword Detection**: Automatic detection of out-of-scope keywords
3. **Data Filtering**: Only provided API data is used as context

### Customizing Scope

Edit `src/config/model.config.ts` to:
- Add/remove in-scope categories
- Modify out-of-scope keywords
- Update response guidelines

## Logging

All queries and responses are logged to `./logs/`:
- `queries-YYYY-MM-DD.json`: All incoming queries
- `responses-YYYY-MM-DD.json`: All bot responses

## Vonage API Setup

1. **Get Vonage Credentials**:
   - Sign up at [Vonage Dashboard](https://dashboard.nexmo.com/)
   - Get your API Key and API Secret
   - Set up WhatsApp sandbox or production number

2. **Configure Webhook**:
   - In Vonage Dashboard, set webhook URL to: `https://your-domain.com/api/whatsapp/webhook`
   - For development, use ngrok or similar: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`

3. **Environment Variables**:
   ```env
   VONAGE_API_KEY=your_api_key
   VONAGE_API_SECRET=your_api_secret
   VONAGE_WHATSAPP_NUMBER=your_whatsapp_number
   ```

## Business API Integration

The bot expects a business API with the following endpoints:

- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/category/:category` - Get FAQs by category
- `GET /api/faqs/search?q=query` - Search FAQs
- `GET /api/faqs/categories` - Get all categories

Expected FAQ format:
```json
{
  "id": "string",
  "category": "string",
  "question": "string",
  "answer": "string",
  "tags": ["string"]
}
```

## Model Configuration Best Practices

1. **Temperature**: Set to 0.7 for balanced creativity and consistency
2. **Max Tokens**: Limit to 500 for WhatsApp-friendly messages
3. **System Prompt**: Keep strict and clear about scope
4. **Context**: Always provide relevant FAQ data as context
5. **Monitoring**: Regularly review logs to ensure scope compliance

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check OLLAMA_URL in `.env`
- Verify model is available: `ollama list`

### Business API Issues
- Verify BUSINESS_API_URL is correct
- Check API is accessible
- Review API response format matches expected structure

### Scope Violations
- Review logs for out-of-scope responses
- Update `model.config.ts` with additional constraints
- Adjust system prompt if needed
- Add more specific keywords to detection

## License

ISC
