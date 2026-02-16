import { Request, Response } from 'express';
import { fetchProgrammes } from '../services/programmes.service';
import { parseProgrammeQuery } from '../utils/parseProgrammeQuery';

export const getProgrammes = async (req: Request, res: Response) => {
  try {
    const query = parseProgrammeQuery(req.query as Record<string, string>);
    let programmes = await fetchProgrammes();

    // Optional filtering
    if (query.scope) {
      programmes = programmes.filter(p => p.scope === query.scope);
    }

    if (query.category) {
      programmes = programmes.filter(p => p.category === query.category);
    }

    res.json(programmes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load programmes' });
  }
};
