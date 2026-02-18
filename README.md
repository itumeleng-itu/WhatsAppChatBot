# CodeTribe Academy Learner Support WhatsApp Bot

A WhatsApp-based chatbot that provides instant, consistent learner support for CodeTribe Academy using AI (Ollama) to humanize responses while maintaining strict scope constraints. Integrated with **Vonage API** for WhatsApp messaging.

## Features

- 🤖 **AI-Powered Responses**: Uses Ollama to generate humanized, natural responses
- 📚 **FAQ Integration**: Fetches data from business API for accurate information
- 🚫 **Scope Enforcement**: Strict configuration prevents out-of-scope responses
- 📊 **Query Logging**: Comprehensive logging for QA purposes
- 📱 **Vonage Integration**: WhatsApp messaging via Vonage API
- ⚡ **Performance Optimized**: Caching, connection pooling, and intelligent FAQ ranking
- 🔄 **Retry Logic**: Automatic retry with exponential backoff for failed API calls
- 📈 **Rate Limiting Awareness**: Respects API rate limits automatically
- 🎯 **Smart Query Understanding**: Category-based search and improved FAQ matching
- ⏱️ **Request Timeouts**: Prevents hanging requests with configurable timeouts

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

4. Update `.env` with your configuration (see `.env.example` for all options):
```env
PORT=3000

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
OLLAMA_MAX_TOKENS=1000
OLLAMA_REQUEST_TIMEOUT_MS=120000

# Business API Configuration
BUSINESS_API_URL=https://mlab-knowledge-api.vercel.app/api
PROGRAM_ID=your_program_id
API_SCOPE=codetribe
API_TIMEOUT_MS=10000
API_CACHE_ENABLED=true
API_CACHE_TTL_MS=600000
API_PREWARM_CACHE=true
API_RATE_LIMIT_AWARE=true
API_LOGGING_ENABLED=true

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
GET /api/mlab/health
```

### API Test & Monitoring
```
GET /api/mlab/test          # Test Business API connectivity
GET /api/mlab/health        # API health check
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

### Testing

Run integration tests:
```bash
npm run test:integration
```

Other test scripts:
```bash
npm run test:cache          # Test caching and pagination
npm run test:speed           # Test performance improvements
npm run test:bot             # Test bot response times
npm run test:bot:quick       # Quick bot response test
npm run test:bot:interactive # Interactive bot testing
```

See `CHANGELOG.md` for detailed information about all changes and improvements.

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

The bot integrates with the mLab Knowledge API (`https://mlab-knowledge-api.vercel.app/api`) with the following endpoints:

- `GET /faqs` - Get all FAQs (supports `scope`, `q`, `category`, `limit`, `offset`)
- `GET /faqs?category=category` - Get FAQs by category
- `GET /faqs?q=query` - Search FAQs
- `GET /programmes/:id` - Get programme details
- `GET /eligibility/:id` - Get eligibility information
- `GET /application-process/:id` - Get application process
- `GET /curriculum/:id` - Get curriculum information
- And more...

### API Features
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Caching**: In-memory cache with TTL and background refresh
- ✅ **Pagination**: Support for `limit` and `offset` parameters
- ✅ **Rate Limiting**: Automatic rate limit detection and respect
- ✅ **Connection Pooling**: Reuses connections for better performance
- ✅ **Request Logging**: Detailed logging of all API calls

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

1. **Temperature**: Set to 0.3 for more deterministic, factual responses
2. **Max Tokens**: Default 1000 for complete responses (configurable via `OLLAMA_MAX_TOKENS`)
3. **System Prompt**: Keep strict and clear about scope (see `src/config/model.config.ts`)
4. **Context**: Top 5 most relevant FAQs are provided as context
5. **Timeout**: Default 120s for complex queries (configurable via `OLLAMA_REQUEST_TIMEOUT_MS`)
6. **Monitoring**: Regularly review logs to ensure scope compliance

## Performance Optimizations

### Caching
- In-memory cache with configurable TTL (default: 10 minutes)
- Pre-warming on startup for frequently accessed data
- Background refresh to keep cache up-to-date
- Reduces API calls by ~80% for cached data

### FAQ Ranking
- Intelligent ranking by relevance score
- Category-based matching for better results
- Partial word matching for plurals/similar words
- Limits context to top 5 FAQs for faster processing

### Connection Management
- HTTP/HTTPS connection pooling
- Keep-alive connections for reuse
- Configurable timeouts to prevent hanging

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
