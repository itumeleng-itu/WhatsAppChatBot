import { Request, Response } from 'express';
import { fetchProgrammes } from '../services/programmes.service';
import { parseProgrammeQuery } from '../utils/parseProgrammeQuery';
import { ProgrammeItem } from '../types/schedules.types';

export const getProgrammes = async (req: Request, res: Response) => {
  try {
    const query = parseProgrammeQuery(req.query as Record<string, string>);
    const response = await fetchProgrammes();

    let data: ProgrammeItem[] = response.data;

    // ? Optional filtering
    if (query.category) {
      data = data.filter(p => p.category === query.category);
    }

    // ? Safe sorting (only allow known fields)
    const sortableFields: (keyof ProgrammeItem)[] = [
      'name',
      'category',
      'duration_weeks',
      'is_active',
    ];

    if (query.sort && sortableFields.includes(query.sort as keyof ProgrammeItem)) {
      const field = query.sort as keyof ProgrammeItem;

      data = [...data].sort((a, b) => {
        if (a[field] < b[field]) return query.order === 'desc' ? 1 : -1;
        if (a[field] > b[field]) return query.order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    res.json({
      data,
      pagination: {
        ...response.pagination,
        total: data.length,
      },
    });
<<<<<<< HEAD
  } catch (error: any) {
    console.error('Error fetching programmes:', error);
    res.status(500).json({
      error: 'Failed to load programmes',
      message: error?.message || 'Unknown error',
    });
=======
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load programmes' });
>>>>>>> 3a63e684efa5989ffa65335b19a7f2fbe87ecb98
  }
};
