import { Request, Response } from 'express';
import { fetchProgrammes } from '../services/programmes.service';
import { handleControllerError, extractQuery } from './controllersutils/controllers.utilscontroller';

export const getProgrammes = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchProgrammes(extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    handleControllerError(res, error, 'programmes');
  }
};