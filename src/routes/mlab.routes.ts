import { Router, Request, Response } from 'express';
import { QueryLogger } from '../services/query-logger.service';
import { BusinessApiService } from '../services/business-api.service';

const router = Router();
const queryLogger = new QueryLogger();
const businessApiService = new BusinessApiService();

/**
 * GET /logs/queries
 * Get query logs for QA purposes
 */
router.get('/logs/queries', async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const logs = await queryLogger.getLogs('queries', date);
    res.json({ success: true, logs, date });
  } catch (error) {
    console.error('Error fetching query logs:', error);
    res.status(500).json({ error: 'Failed to fetch query logs' });
  }
});

/**
 * GET /logs/responses
 * Get response logs for QA purposes
 */
router.get('/logs/responses', async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const logs = await queryLogger.getLogs('responses', date);
    res.json({ success: true, logs, date });
  } catch (error) {
    console.error('Error fetching response logs:', error);
    res.status(500).json({ error: 'Failed to fetch response logs' });
  }
});

/**
 * GET /api/test
 * Test Business API connection and return connection status
 * Useful for monitoring and debugging API connectivity
 */
router.get('/api/test', async (req: Request, res: Response) => {
  try {
    const connectionStatus = await businessApiService.testConnection();
    
    if (connectionStatus.connected) {
      res.json({
        success: true,
        message: 'Business API connection successful',
        ...connectionStatus,
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Business API connection failed',
        ...connectionStatus,
      });
    }
  } catch (error: any) {
    console.error('Error testing API connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test API connection',
      message: error.message,
    });
  }
});

/**
 * GET /health
 * Health check endpoint that verifies Business API connectivity
 * Returns 200 if API is reachable, 503 if not
 * Useful for load balancers, monitoring tools, and health checks
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const connectionStatus = await businessApiService.testConnection();
    
    if (connectionStatus.connected) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        api: {
          connected: true,
          url: connectionStatus.apiUrl,
          latency: connectionStatus.latency,
        },
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        api: {
          connected: false,
          url: connectionStatus.apiUrl,
          error: connectionStatus.error,
          latency: connectionStatus.latency,
        },
      });
    }
  } catch (error: any) {
    console.error('Error checking health:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Failed to check API health',
      message: error.message,
    });
  }
});

export default router;