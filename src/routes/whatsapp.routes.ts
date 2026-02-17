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
  try {
    // Parse Vonage webhook format
    const parsedMessage = vonageService.parseIncomingMessage(req.body);

    if (!parsedMessage || !parsedMessage.from || !parsedMessage.message) {
      console.log('Invalid webhook payload:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { from, message, messageId } = parsedMessage;

    // Extract learner ID (phone number from Vonage)
    const learnerId = from;

    // Process the query
    const chatResponse = await personaAgent.processQuery(learnerId, message);

    // Send response via Vonage API
    const sendResult = await vonageService.sendMessage(from, chatResponse.message);

    if (!sendResult.success) {
      console.error('Failed to send message via Vonage:', sendResult.error);
      // Still return 200 to Vonage to acknowledge receipt
      // Log the error for manual follow-up
    }

    // Return 200 to acknowledge webhook receipt
    // Vonage expects 200 status code
    res.status(200).json({
      status: 'received',
      messageId: sendResult.messageId,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 200 to prevent Vonage from retrying
    // Log error for investigation
    res.status(200).json({
      status: 'error',
      message: 'Failed to process message',
    });
  }
});

/**
 * POST /chat
 * Direct chat endpoint (for testing or alternative interfaces)
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { learnerId, query } = req.body;

    if (!learnerId || !query) {
      return res.status(400).json({ error: 'Missing learnerId or query' });
    }

    // Process the query
    const chatResponse = await personaAgent.processQuery(learnerId, query);

    res.json({
      success: true,
      response: chatResponse.message,
      confidence: chatResponse.confidence,
      category: chatResponse.category,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process query',
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
