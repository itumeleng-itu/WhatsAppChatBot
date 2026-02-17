import { Router, Request, Response } from 'express';
import { QueryLogger } from '../services/query-logger.service';

const router = Router();
const queryLogger = new QueryLogger();

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

export default router;