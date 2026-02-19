import { Router, Request, Response } from 'express';
import { PersonaAgent } from '../agents/persona';
import { VonageService } from '../services/vonage.service';

const router = Router();
const personaAgent = new PersonaAgent();
const vonageService = new VonageService();

/**
 * POST /webhook
 * Vonage WhatsApp webhook endpoint for incoming messages
 */
router.post('/webhook', async (req: Request, res: Response) => {
  console.log('Incoming Webhook Body:', JSON.stringify(req.body, null, 2));
  // Handle status updates (delivery receipts)
  if (req.body.status || (req.body.message_uuid && !req.body.message && !req.body.content && !req.body.text)) {
    console.log('Received status update:', req.body.status);
    return res.status(200).send('OK');
  }

  const parsedMessage = vonageService.parseIncomingMessage(req.body);

  if (!parsedMessage || !parsedMessage.from || !parsedMessage.message) {
    console.log('Invalid webhook payload:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { from, message } = parsedMessage;
  const learnerId = from;

  try {
    const chatResponse = await personaAgent.processQuery(learnerId, message);
    const sendResult = await vonageService.sendMessage(from, chatResponse.message);

    res.status(200).json({
      status: 'received',
      messageId: sendResult.messageId,
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to process message',
    });
  }
});

/**
 * POST /chat
 * Direct chat endpoint (for testing or alternative interfaces)
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const learnerId = req.body.learnerId ?? req.body.userId;
    const query = req.body.query ?? req.body.message;

    if (!learnerId || !query) {
      return res.status(400).json({
        error: 'Missing required fields',
        expected: 'learnerId (or userId) and query (or message)',
      });
    }

    const chatResponse = await personaAgent.processQuery(learnerId, query);

    res.json({
      success: true,
      response: chatResponse.message,
      confidence: chatResponse.confidence,
      category: chatResponse.category,
    });
  } catch (error: any) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error?.message || 'Internal server error',
    });
  }
});

/**
 * GET /categories
 * Get available FAQ categories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await personaAgent.getAvailableCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * GET /webhook
 * Vonage webhook status endpoint (for webhook verification)
 */
router.get('/webhook', (req: Request, res: Response) => {
  // Vonage may send GET requests for webhook verification
  res.status(200).json({
    status: 'ok',
    message: 'Vonage webhook endpoint is active',
  });
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CodeTribe WhatsApp ChatBot (Vonage)',
    vonageConfigured: !!process.env.VONAGE_API_KEY,
  });
});

export default router;
