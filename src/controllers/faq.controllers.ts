import { Request, Response } from 'express';
import { fetchFaqs } from '../services/faq.services';
import { handleControllerError, extractQuery } from './controllersutils/controllers.utilscontroller';
import { parseFaqQueryParams } from '../utils/parseFaqQuery';

export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = parseFaqQueryParams(req.query as Record<string, string>);
    if (!query) {
      res.status(400).json({ error: 'Missing required query parameters: q and scope' });
      return;
    }
    let faq = await fetchFaqs();

    //? Optional filtering
    if (query.scope) {
      faq = faq.filter(p => p.source === query.source);
    }

    if (query.category) {
      faq = faq.filter(p => p.category === query.category);
    }

    res.json(faq);
  } catch (error: any) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      error: 'Failed to load FAQ',
      message: error?.message || 'Unknown error',
    });
  }
};