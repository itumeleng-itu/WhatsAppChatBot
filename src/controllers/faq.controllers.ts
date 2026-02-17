import { Request, Response } from 'express';
import { fetchfaq } from '../services/faq.services';
import { parseFaqQuery } from '../utils/parseFaqQuery'; 

export const getFaq = async (req: Request, res: Response) => {
  try {
    const query = parseFaqQuery(req.query as Record<string, string>);
    let faq = await fetchfaq();

    //? Optional filtering
    if (query.scope) {
      faq = faq.filter(p => p.scope === query.source);
    }

    if (query.category) {
      faq = faq.filter(p => p.category === query.category);
    }

    res.json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load FAQ' });
  }
};
