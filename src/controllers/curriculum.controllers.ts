import { Request, Response } from 'express';
import { fetchCurriculum } from '../services/curriculum.service';
import { handleControllerError, extractQuery, extractParam } from './controllersutils/controllers.utilscontroller';

export const getCurriculum = async (req: Request, res: Response): Promise<void> => {
  try {
    const programmeId = extractParam(req, 'programmeId');

    if (!programmeId) {
      res.status(400).json({ error: 'programmeId is required' });
      return;
    }

    const data = await fetchCurriculum(programmeId, extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    handleControllerError(res, error, 'curriculum');
  }
};