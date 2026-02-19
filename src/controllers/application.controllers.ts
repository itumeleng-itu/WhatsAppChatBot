import { Request, Response } from 'express';
import { fetchApplicationSteps } from '../services/application.services';
import { handleControllerError, extractQuery, extractParam } from './controllersutils/controllers.utilscontroller';

export const getApplicationSteps = async (req: Request, res: Response): Promise<void> => {
  try {
    const programmeId = extractParam(req, 'programmeId');

    if (!programmeId) {
      res.status(400).json({ error: 'programmeId is required' });
      return;
    }

    const data = await fetchApplicationSteps(programmeId, extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    handleControllerError(res, error, 'application steps');
  }
};
