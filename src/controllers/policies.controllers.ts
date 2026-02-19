import { Request, Response } from 'express';
import { fetchPolicies } from '../services/policies.servece';
import { handleControllerError, extractQuery } from './controllersutils/controllers.utilscontroller';

export const getPolicies = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchPolicies(extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    handleControllerError(res, error, 'policies');
  }
};