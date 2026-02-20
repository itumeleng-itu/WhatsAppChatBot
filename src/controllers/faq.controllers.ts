import { Request, Response } from 'express';
import { fetchFaqs } from '../services/faq.services';
import { extractQuery, handleControllerError } from './controllersutils/controllers.utilscontroller';


export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchFaqs(extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    const isBadRequest =
      error instanceof Error && error.message.includes('required parameters');

    if (isBadRequest) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }

    handleControllerError(res, error, 'FAQs');
  }
};