import { Request, Response } from 'express';
import { fetchFaq } from '../services/faq.services';
import { handleControllerError, extractQuery } from './/controllersutils/controllers.utilscontroller';

export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchFaq(extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    // fetchFaq throws a descriptive error if q or scope are missing
    const isBadRequest =
      error instanceof Error && error.message.includes('required parameters');

    if (isBadRequest) {
      res.status(400).json({ error: error.message });
      return;
    }

    handleControllerError(res, error, 'FAQs');
  }
};